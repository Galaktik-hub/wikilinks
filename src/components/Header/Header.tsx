import Logo from './Logo';

const Header = () => {
    return (
        <header className={"w-full px-6 py-4 bg-sea-salt relative"}>
            <div className={"max-w-7xl mx-auto flex justify-between items-center"}>
                <Logo text={"ikiLinks"}/>
            </div>
        </header>
    );
};

export default Header;