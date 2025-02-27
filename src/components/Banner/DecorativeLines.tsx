export const DecorativeLines = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Lignes verticales pour mobile */}
            <div className="md:hidden">
                <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[15%]" />
                <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[30%]" />
            </div>

            {/* Lignes verticales pour desktop */}
            <div className="hidden md:block">
                <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[10%]" />
                <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[22.5%]" />
                <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[35%]" />
                <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[47.5%]" />
                <div className="absolute h-full w-px bg-[#60A5FA] opacity-20 left-[60%]" />
            </div>
        </div>
    );
};
