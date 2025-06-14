"use client";
import React, {useState} from "react";
import CloseSVG from "../../assets/WaitingRoom/CloseSVG.tsx";
import {Timeline, Text} from "@mantine/core";
import {ModalProps, ModalFormProps, ModalConfirmationProps, ModalTimelineProps, formatContent} from "./ModalProps.ts";
import {timelineConfig} from "./TimelineConfig.tsx";
import {AutocompleteArticle} from "../Sections/Game/Inventory/AutocompleteArticle.tsx";

const Modal: React.FC<ModalProps> = ({isOpen, onClose, title, type, content}) => {
    const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-darkBg p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-md mx-4 transform transition-all flex flex-col gap-5">
                <div className="relative flex justify-center items-center w-full">
                    <h2 className="blue-title-effect text-xl">{title}</h2>
                    {(content.cancelButton !== undefined || type === "confirmation") && (
                        <button onClick={onClose} className="absolute right-0 text-gray-400 hover:text-white transition-all">
                            <CloseSVG onClick={() => (isOpen = false)} />
                        </button>
                    )}
                </div>

                {content.message && <p className="text-white text-center">{content.message}</p>}

                {/* Affichage du contenu en fonction du type de modal */}
                {type === "form" ? (
                    // Modal avec formulaire
                    <div className="space-y-4">
                        {(content as ModalFormProps).inputFields.map(field => (
                            <div key={field.id} className="relative">
                                <input
                                    type={field.type || "text"}
                                    value={field.value}
                                    onChange={e => field.onChange(e.target.value)}
                                    onFocus={() => setFocusedFieldId(field.id)}
                                    onBlur={() => setTimeout(() => setFocusedFieldId(null), 150)}
                                    onKeyDown={field.onKeyDown}
                                    className="w-full px-4 py-3 bg-[#12151A] text-white rounded-lg border border-gray-700 focus:border-bluePrimary focus:ring-1 focus:ring-bluePrimary transition-all outline-none"
                                    placeholder={field.placeholder}
                                    autoFocus={field.autoFocus}
                                    maxLength={field.maxLength}
                                    autoComplete={field.autoComplete}
                                />
                                {field.autoComplete === "on" && focusedFieldId === field.id && (
                                    <AutocompleteArticle query={field.value} onSelect={value => field.onChange(value)} />
                                )}
                            </div>
                        ))}
                        <div className="flex gap-4 justify-center">
                            {(content as ModalFormProps).cancelButton && (
                                <button
                                    onClick={() => {
                                        (content as ModalConfirmationProps).cancelButton!.onClick();
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                                    {(content as ModalConfirmationProps).cancelButton!.label}
                                </button>
                            )}
                            <button
                                onClick={(content as ModalFormProps).submitButton.onClick}
                                disabled={(content as ModalFormProps).submitButton.disabled || !(content as ModalFormProps).isValid}
                                className={`py-2 px-4 rounded-lg transition-all 
                                    ${
                                        (content as ModalFormProps).submitButton.disabled || !(content as ModalFormProps).isValid
                                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                            : "bg-blueSecondary hover:bg-blue-900 text-white"
                                    }`}>
                                {(content as ModalFormProps).submitButton.label}
                            </button>
                        </div>
                    </div>
                ) : type === "confirmation" ? (
                    // Modal avec message de confirmation
                    <div className="text-white text-center">
                        {/*<p className="mb-4">{(content as ModalConfirmationProps).message}</p>*/}
                        <div className="flex gap-4 justify-center">
                            {(content as ModalConfirmationProps).cancelButton && (
                                <button
                                    onClick={() => {
                                        (content as ModalConfirmationProps).cancelButton!.onClick();
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
                                    {(content as ModalConfirmationProps).cancelButton!.label}
                                </button>
                            )}
                            <button
                                onClick={(content as ModalConfirmationProps).okButton.onClick}
                                className="bg-blueSecondary hover:bg-blue-900 text-white py-2 px-4 rounded-lg">
                                {(content as ModalConfirmationProps).okButton.label}
                            </button>
                        </div>
                    </div>
                ) : type === "timeline" ? (
                    // Type "timeline"
                    <div className="overflow-auto text-white pt-2 pb-2 max-h-[400px]">
                        <Timeline active={(content as ModalTimelineProps).timelineSteps.length} bulletSize={24} lineWidth={2}>
                            {(content as ModalTimelineProps).timelineSteps.map((step, id) => {
                                const config = timelineConfig[step.type];
                                if (step.data) {
                                    Object.keys(step.data).forEach(key => {
                                        if (step.data) {
                                            step.data[key] = step.data[key].replace(/_/g, " ");
                                        }
                                    });
                                }
                                const stepContent =
                                    config.content && step.data ? formatContent(config.content, (content as ModalTimelineProps).username, step.data) : null;
                                return (
                                    <Timeline.Item key={id} bullet={config.icon} color={config.color} title={config.title}>
                                        {stepContent && (
                                            <Text c="dimmed" size="sm">
                                                {stepContent}
                                            </Text>
                                        )}
                                    </Timeline.Item>
                                );
                            })}
                        </Timeline>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Modal;
