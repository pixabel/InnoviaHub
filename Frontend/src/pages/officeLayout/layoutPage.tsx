import Layout from "../../components/officeLayout/layout";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";

const LayoutPage = () => {
    return (
        <div className="layoutPage">
            <div className="headerAndNav">
                <Header />
                <Navbar />
            </div>
            <Layout />
        </div>
    );
}

export default LayoutPage;