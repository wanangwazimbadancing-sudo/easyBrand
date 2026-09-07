import React,{ useEffect, useState } from "react";
import axios from "axios";

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(-1);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get("https://easybrand.onrender.com/api/page-data/faqs");
                const data = Array.isArray(response.data?.faqs) ? response.data.faqs : [];
                setFaqs(data);
            } catch (error) {
                console.error("Failed to load FAQs:", error);
                setFaqs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (



            <div className="bg-[#FAFAFA] my-9 flex items-center justify-center py-12 px-4 h-[100dvh]" id="questions">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-12">
                        <p className="text-sm font-medium tracking-wider text-slate-900 mb-2">FAQ'S</p>
                        <h1 className="text-3xl font-medium text-zinc-800">Everything you need to know</h1>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center text-sm text-zinc-500">Loading FAQs...</p>
                        ) : faqs.length === 0 ? (
                            <p className="text-center text-sm text-zinc-500">No FAQs available yet.</p>
                        ) : (
                            faqs.map((faq, index) => (
                                <div key={faq.id || index}>
                                    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                                        <button onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors">
                                            <span className="text-sm text-zinc-800 pr-4">{faq.question}</span>
                                            <span className="shrink-0">
                                                {openIndex === index ? (
                                                   <div className='size-7 rounded-full bg-black/4 flex items-center justify-center cursor-pointer'>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="m8.348 8.348 6.874 6.874m.001-6.874-6.875 6.874" stroke="#000" strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                   </div>
                                                ) : (
                                                    <div className='size-7 rounded-full bg-black/4 flex items-center justify-center cursor-pointer'>
                                                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3.472 8.332h9.722M8.333 3.473v9.722" stroke="#000" strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </span>
                                        </button>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-5 py-4">
                                            <p className="text-sm font-light text-zinc-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

    )
}

export default FAQ;