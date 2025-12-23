import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import PlayerWrapper from "@/components/players/PlayerWrapper";

export default async function Page({ params }) {
    const { id } = await params;

    return (
        <>
            <Header />
            <PlayerWrapper id={id} />
            <Footer />
        </>
    );
}