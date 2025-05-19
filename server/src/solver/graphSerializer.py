#! /usr/bin/env python3
"""
Extract the page contents from the Wikipedia dump, extract links in a graph form,
store intermediate graph using titles, convert to id-based graph, and dump to file.
"""
import bz2
import sys
import re
from xml.dom.pulldom import START_ELEMENT, parse

INFOBOX_STARTERS = ("[[", "]]", "{{", "}}", "|", "<!", "*", "=", "{|")


class Graph:
    def __init__(self):
        self.nodesStr: dict[int, list[str]] = {}
        self.nodesId: dict[int, list[int]] = {}

    def addNode(self, node_id: int):
        if node_id not in self.nodesStr:
            self.nodesStr[node_id] = []

    def addEdge(self, from_id: int, to_title: str):
        if from_id not in self.nodesStr:
            self.nodesStr[from_id] = []
        self.nodesStr[from_id].append(to_title)

    def convertToIdGraph(self, id_store):
        for from_id, titles in self.nodesStr.items():
            self.nodesId[from_id] = []
            for title in titles:
                norm_title = normalizeTitle(title)
                if norm_title in id_store.ids:
                    self.nodesId[from_id].append(id_store.ids[norm_title])

    def dumpToFile(self, filepath: str):
        with open(filepath, "w", encoding="utf-8") as f:
            for node_id, edges in self.nodesId.items():
                f.write(f"id={node_id}\n")
                f.write(f"l={len(edges)}\n")
                for eid in edges:
                    f.write(f"l={eid}\n")
                f.write("\n")


class idStorer:
    def __init__(self):
        self.ids: dict[str, int] = {}

    def storeId(self, title: str, page_id: int):
        norm = normalizeTitle(title)
        self.ids[norm] = int(page_id)



def normalizeTitle(s):
    return s.strip().replace("_", " ").lower()


def getText(nodelist):
    rc = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            rc.append(node.data)
    return ''.join(rc)


def parseWikiText(text):
    i = 0
    lines = text.split("\n")
    box_continuation = False
    for line in lines:
        l = line.strip()
        if box_continuation or not l or any(map(lambda x: l.startswith(x), INFOBOX_STARTERS)):
            i += 1
            box_continuation = l.endswith("<br />")
        else:
            break
    text = "\n".join(lines[i:])
    links = set()
    for m in re.finditer(r"\[\[([^]]+)]]|\{\{([^}]+)}}", text):
        data = m.group(1) if m.group(1) else m.group(2)
        data_elements = data.split("|")
        if m.group(1):
            links.add(data_elements[0].strip())
    return links


def extract(source, output_file):
    graph = Graph()
    id_store = idStorer()

    if source.endswith('.bz2'):
        stream = bz2.open(source, mode='rt', errors='ignore', encoding="UTF-8")
    else:
        stream = open(source, mode='r', errors='ignore')

    title_search_pattern = re.compile(r'(?<=[A-Za-z0-9]):(?=[A-Za-z0-9])')

    i = 0
    j = 0
    doc = parse(stream)
    for event, node in doc:
        if event == START_ELEMENT and node.localName == "page":
            doc.expandNode(node)
            title = getText(node.getElementsByTagName("title")[0].childNodes)
            if title_search_pattern.search(title):
                j += 1
                if j % 1000 == 0:
                    print(f"Skipped {j} pages", file=sys.stderr)
                continue
            page_id = int(getText(node.getElementsByTagName("id")[0].childNodes))
            id_store.storeId(title, page_id)
            try:
                redirect = node.getElementsByTagName("redirect")[0].getAttribute("title")
            except:
                redirect = None

            if not redirect:
                text = getText(node.getElementsByTagName("text")[0].childNodes)
                links = parseWikiText(text)
                graph.addNode(int(page_id))
                for link_title in links:
                    graph.addEdge(int(page_id), normalizeTitle(link_title))
            else:
                graph.addNode(int(page_id))
                graph.addEdge(int(page_id), normalizeTitle(redirect))

            i += 1
            if i % 1000 == 0:
                print(f"Processed {i} pages", file=sys.stderr)

    # Convert to int-based graph and dump
    graph.convertToIdGraph(id_store)
    graph.dumpToFile(output_file)
    print("Graph extraction complete.", file=sys.stderr)


if __name__ == "__main__":
    extract(r"C:\Users\Utilisateur\Downloads\frwiki-20250501-pages-articles-multistream.xml.bz2", "graph.txt")