export const DecorativeLines = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Vertical lines on the left */}
            <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[15%]" />
            <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[30%]" />
        </div>
    );
};
