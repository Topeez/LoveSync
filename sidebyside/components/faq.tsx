import {
    HeartHandshake,
    Lock,
    MessageCircleHeart,
    Smartphone,
    Sparkles,
    Users,
} from "lucide-react";

const faq = [
    {
        icon: Users,
        question: "Jak propojím účet s partnerem?",
        answer: "Je to snadné. Po registraci dostanete unikátní párovací kód (nebo odkaz), který pošlete své polovičce. Jakmile ho zadá, vaše profily se propojí a můžete začít společně plánovat.",
    },
    {
        icon: Lock,
        question: "Jsou naše data v bezpečí?",
        answer: "Absolutně. Vaše soukromí je priorita. Vzkazy, fotky a události vidíte pouze vy a váš partner. Data jsou šifrována a bezpečně uložena v databázi.",
    },
    {
        icon: Sparkles,
        question: "Je aplikace zdarma?",
        answer: "Základní verze SideBySide je zdarma a obsahuje všechny klíčové funkce jako kalendář, sdílené úkoly a počítadlo výročí. Plánujeme i prémiové funkce pro náročnější páry.",
    },
    {
        icon: Smartphone,
        question: "Funguje to na mobilu?",
        answer: "Ano! SideBySide je plně responzivní webová aplikace. Můžete si ji také přidat na plochu telefonu a nainstalovat jako webovou aplikaci a je to! Bude se chovat téměř jako nativní aplikace.",
    },
    {
        icon: MessageCircleHeart,
        question: "Co když se rozejdeme?",
        answer: 'Věříme, že se to nestane! Ale pokud ano, můžete v nastavení profilu zrušit propojení ("Unpair"). Tím se vaše data oddělí a přestanete sdílet nové informace.',
    },
    {
        icon: HeartHandshake,
        question: "Můžu navrhnout novou funkci?",
        answer: "Určitě! Aplikaci vyvíjíme pro vás. Pokud vám něco chybí nebo máte nápad na vylepšení, napište nám přes kontaktní formulář nebo přímo na GitHub.",
    },
];

const FAQ = () => {
    return (
        <div className="flex justify-center items-center px-6 py-12 min-h-screen">
            <div className="max-w-5xl">
                {" "}
                {/* Upravil jsem max-width pro lepší čitelnost */}
                <h2 className="font-bold text-4xl md:text-5xl text-center leading-[1.15] tracking-tight">
                    Často kladené dotazy
                </h2>
                <p className="mt-4 text-muted-foreground text-lg md:text-xl text-center">
                    Rychlé odpovědi na vše, co vás o SideBySide zajímá.
                </p>
                <div className="gap-6 grid md:grid-cols-2 mt-12">
                    {faq.map(({ question, answer, icon: Icon }) => (
                        <div
                            className="group bg-card shadow-sm hover:shadow-md p-8 border hover:border-primary/20 rounded-2xl transition-all"
                            key={question}
                        >
                            <div className="flex justify-center items-center bg-primary/10 rounded-xl w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300">
                                <Icon className="size-6" />
                            </div>
                            <h3 className="mt-6 mb-3 font-semibold text-xl tracking-tight">
                                {question}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
