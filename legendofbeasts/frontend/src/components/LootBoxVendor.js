import React, { useState, useEffect } from "react";
export function LootBoxVendor({ lob, vendor, selectedAddress }) {
    const [error, setError] = useState('');
    async function _buyWithLOB(option) {
        setError('');
        let price = await vendor.getFeeToken(option);
        let balance = await lob.balanceOf(selectedAddress);
        if (price.gt(balance)) {
            setError("Insufficient LOB balance");
            return;
        }
        let allowance = await lob.allowance(selectedAddress, vendor.address);
        if (allowance.lt(price)) {
            await lob.approve(vendor.address, 500000000);
        }
        await vendor.buyWithToken(option, 1);
    }

    async function _buyWithEther(option) {
        let price = await vendor.getFeeEther(option);
        await vendor.buy(option, 1, { value: price });
    }
    return (
        <>
            <h1>Sale: 50% off everything!</h1>
            {error != '' && (
                <div className="alert alert-danger">{error}</div>
            )}
            <h4>Buy With LOB</h4>
            <div className="btn-group">
                <a className="btn btn-primary" onClick={() => _buyWithLOB(0)}>S Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(1)}>SS Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(2)}>SSS Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(3)}>Gold Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(4)}>Diamond Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(5)}>Normal Box 1</a>
                <a className="btn btn-primary" onClick={() => _buyWithLOB(6)}>Normal Box 2</a>
            </div>
            <h4>Buy With ETH</h4>
            <div className="btn-group">
                <a className="btn btn-primary" onClick={() => _buyWithEther(0)}>S Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithEther(1)}>SS Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithEther(2)}>SSS Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithEther(3)}>Gold Box</a>
                <a className="btn btn-primary" onClick={() => _buyWithEther(4)}>Diamond Box</a>
            </div>
        </>
    );
}