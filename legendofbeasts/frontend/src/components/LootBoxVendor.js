import React, { useState, useEffect } from "react";
export function LootBoxVendor({ lob, vendor, lootbox }) {
    async function _buyWithLOB(option) {
        await lob.approve(vendor.address, 500000000);
        await vendor.buyWithToken(option, 1);
    }
    return (
        <>
            <h1>Sale: buy one get one free!</h1>
            <div className="btn-group">
                <a className="btn btn-primary" onClick={() => _buyWithLOB(0)}>S Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(1)}>SS Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(2)}>SSS Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(3)}>Gold Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(4)}>Diamond Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(5)}>Normal Box 1</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(6)}>Normal Box 2</a>
            </div>
        </>
    );
}