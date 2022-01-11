import React, { useState, useEffect } from "react";
export function LootBoxVendor({ lob, vendor, lootbox }) {
    async function _buyWithLOB(option) {
        await lob.approve(vendor.address, 500000000);
        await vendor.buyWithToken(option, 1);
    }
    return (
        <>
            <h1>Sale: buy one get one free!</h1>
            <ul>
                <li><a className="btn" onClick={() => _buyWithLOB(0)}>Buy S Box</a></li>
                <li><a className="btn" onClick={() => _buyWithLOB(1)}>Buy SS Box</a></li>
                <li><a className="btn" onClick={() => _buyWithLOB(2)}>Buy SSS Box</a></li>
                <li><a className="btn" onClick={() => _buyWithLOB(3)}>Buy Gold Box</a></li>
                <li><a className="btn" onClick={() => _buyWithLOB(4)}>Buy Diamond Box</a></li>
                <li><a className="btn" onClick={() => _buyWithLOB(5)}>Buy Normal Box 1</a></li>
                <li><a className="btn" onClick={() => _buyWithLOB(6)}>Buy Normal Box 2</a></li>
            </ul>
        </>
    );
}