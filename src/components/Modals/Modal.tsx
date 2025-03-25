"use client";
import * as React from "react";
import CloseSVG from "../../assets/WaitingRoom/CloseSVG.tsx";
import { Timeline, Text } from "@mantine/core";
import {ModalProps, ModalFormProps, ModalConfirmationProps, ModalTimelineProps, formatContent} from "./ModalProps.ts";
import {timelineConfig} from "./TimelineConfig.tsx";

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, type, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center  ">
            <div className="bg-[#181D25] p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-md mx-4 transform transition-all flex flex-col gap-5">

                <div className="relative flex justify-center items-center w-full">
                    <h2 className="text-xl font-bold text-sky-500 text-center" style={{ textShadow: "0px 0px 14px #0ea5e9" }}>
                        {title}
                    </h2>
                    {type !== "form" ? (
                        <button onClick={onClose} className="absolute right-0 text-gray-400 hover:text-white transition-all">
                            <CloseSVG onClick={() => isOpen = false} />
                        </button>
                    ) : null}
                </div>

                {description && <p className="text-white text-center mb-6">{description}</p>}

                {/* Affichage du contenu en fonction du type de modal */}
                {type === "form" ? (
                    // Modal avec formulaire
                    <div className="space-y-4">
                        {(content as ModalFormProps).inputFields.map((field) => (
                            <div key={field.id} className="relative">
                                <input
                                    type={field.type || "text"}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onKeyDown={field.onKeyDown}
                                    className="w-full px-4 py-3 bg-[#12151A] text-white rounded-lg border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none"
                                    placeholder={field.placeholder}
                                    autoFocus={field.autoFocus}
                                    maxLength={field.maxLength}
                                />
                            </div>
                        ))}

                        <button
                            onClick={(content as ModalFormProps).submitButton.onClick}
                            disabled={(content as ModalFormProps).submitButton.disabled || !(content as ModalFormProps).isValid}
                            className={`w-full py-2 rounded-lg transition-all 
                                ${((content as ModalFormProps).submitButton.disabled || !(content as ModalFormProps).isValid) 
                                    ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                        >
                            {(content as ModalFormProps).submitButton.label}
                        </button>
                    </div>
                ) : type === "confirmation" ? (
                    // Modal avec message de confirmation
                    <div className="text-white text-center">
                        <p className="mb-4">{(content as ModalConfirmationProps).message}</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {isOpen = false; onClose()}}
                                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                            >
                                {(content as ModalConfirmationProps).cancelButton.label}
                            </button>
                            <button
                                onClick={(content as ModalConfirmationProps).okButton.onClick}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                            >
                                {(content as ModalConfirmationProps).okButton.label}
                            </button>
                        </div>
                    </div>
                ) : type === "timeline" ? (
                    // Type "timeline"
                    <div className="overflow-auto text-white pt-2 pb-2 max-h-[400px]">
                        <Timeline
                            active={(content as ModalTimelineProps).timelineSteps.length}
                            bulletSize={24}
                            lineWidth={2}
                        >
                            {(content as ModalTimelineProps).timelineSteps.map((step) => {
                                const config = timelineConfig[step.type];
                                const stepContent =
                                    config.content && step.data
                                        ? formatContent(
                                            config.content,
                                            (content as ModalTimelineProps).username,
                                            step.data
                                        )
                                        : null;
                                return (
                                    <Timeline.Item
                                        key={step.id}
                                        bullet={config.icon}
                                        color={config.color}
                                        title={config.title}>
                                        {stepContent && <Text c="dimmed" size="sm">{stepContent}</Text>}
                                    </Timeline.Item>
                                );
                            })}
                        </Timeline>
                    </div>
                ) : null }
            </div>
        </div>
    );
};

export default Modal;
