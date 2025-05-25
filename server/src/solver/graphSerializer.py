#! /usr/bin/env python3
"""
Extract the page contents from the Wikipedia dump, extract links in a graph form,
store intermediate graph using titles, convert to id-based graph, and dump to file.
Each node also has a graph_id, assigned sequentially starting from 0 in the order nodes are added.
Edges in the dump file are serialized using these graph_ids.
"""
import bz2
import sys
import re
from xml.dom.pulldom import START_ELEMENT, parse

INFOBOX_STARTERS = ("[[", "]]", "{{", "}}", "|", "<!", "*", "=", "{|")

title_search_pattern = re.compile(r'(?<=[A-Za-z0-9]):(?=[A-Za-z0-9])')
link_pattern = re.compile(r"\[\[([^]]+)]]|\{\{([^}]+)}}")

class Graph:
    def __init__(self):
        # mapping from page_id to list of linked titles
        self.nodesStr: dict[int, list[str]] = {}
        # mapping from page_id to list of linked page_ids
        self.nodesId: dict[int, list[int]] = {}
        # sequential counter for total edges
        self.verticesLength = 0
        # map page_id to assigned graph_id
        self.nodeGraphId: dict[int, int] = {}
        # next graph_id
        self._next_graph_id = 0

    def addNode(self, node_id: int):
        if node_id not in self.nodesStr:
            # record the node and assign a graph_id
            self.nodesStr[node_id] = []
            self.nodeGraphId[node_id] = self._next_graph_id
            self._next_graph_id += 1

    def addEdge(self, from_id: int, to_title: str):
        if from_id not in self.nodesStr:
            # ensure node exists and gets a graph_id
            self.addNode(from_id)
        self.nodesStr[from_id].append(to_title)
        self.verticesLength += 1

    def convertToIdGraph(self, id_store):
        # convert stored title edges to id edges
        for from_id, titles in self.nodesStr.items():
            if from_id not in self.nodesId:
                self.nodesId[from_id] = []
            for title in titles:
                if title in id_store.ids:
                    self.nodesId[from_id].append(id_store.ids[title])

    def dumpToFile(self, filepath: str):
        with open(filepath, "w", encoding="utf-8") as f:
            # header: number of nodes and total edges
            f.write(f"{len(self.nodesId)} {self.verticesLength}\n")
            position_in_array = 0
            # write node lines: page_id, graph_id, position, degree
            for node_id in self.nodesId:
                graph_id = self.nodeGraphId[node_id]
                degree = len(self.nodesId[node_id])
                f.write(f"{node_id} {graph_id} {position_in_array} {degree}\n")
                position_in_array += degree
            # separator and edge list (using graph_ids)
            f.write("-\n")
            for from_id, edges in self.nodesId.items():
                from_gid = self.nodeGraphId[from_id]
                for to_id in edges:
                    to_gid = self.nodeGraphId[to_id]
                    f.write(f"{from_gid} {to_gid}\n")


class idStorer:
    def __init__(self):
        self.ids: dict[str, int] = {}

    def storeId(self, title: str, page_id: int):
        self.ids[title] = int(page_id)


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
    for m in link_pattern.finditer(text):
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

    i = j = 0
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
            except IndexError:
                redirect = None

            # ensure node is registered with a graph_id
            graph.addNode(page_id)

            if not redirect:
                text = getText(node.getElementsByTagName("text")[0].childNodes)
                links = parseWikiText(text)
                for link_title in links:
                    graph.addEdge(page_id, link_title)
            else:
                graph.addEdge(page_id, redirect)

            i += 1
            if i % 1000 == 0:
                print(f"Processed {i} pages", file=sys.stderr)

    # Convert to id-based graph and dump
    graph.convertToIdGraph(id_store)
    graph.dumpToFile(output_file)
    print("Graph extraction complete.", file=sys.stderr)


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "graph.bz2"
    extract(r"C:\Users\Utilisateur\Downloads\frwiki-20250501-pages-articles-multistream.xml.bz2", "graph.txt")