const fs = require("fs");
const output = require("d3node-output");
const d3 = require("d3-node")().d3;
const d3nLine = require("..");

const margin = { top: 2, right: 2, bottom: 2, left: 2 };
const width = 150;
const height = 40;

async function ok() {
    try {
        await d3.json(
            "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly",
            (d) => {
                d = d.market_caps;
                const returnData = d.map((el, i) => {
                    return {
                        key: d[i][0],
                        value: d[i][1],
                    };
                });
                output("./examples/output", d3nLine({ data: returnData }), {
                    // width: width + margin.left + margin.right,
                    // height: height + margin.top + margin.bottom,
                });
            }
        );
    } catch (error) {
        console.log(error);
    }
}
ok();
