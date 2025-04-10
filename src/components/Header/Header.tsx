import Logo from "./Logo";

const Header = () => {
    return (
        <header className={"w-full px-6 py-4 bg-sea-salt relative flex justify-center"}>
            <div className={"max-w-7xl mx-auto flex justify-between items-center"}>
                <Logo />
            </div>
        </header>
    );
};

export default Header;
