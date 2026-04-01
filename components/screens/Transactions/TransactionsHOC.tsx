"use client";

import dynamic from "next/dynamic";

const Transactions = dynamic(() => import("./Transactions"), { ssr: false });

const TransactionsHOC = () => {
    return (
        <Transactions />
    );
};

export default TransactionsHOC;