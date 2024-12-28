import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { gpus } from "./data/gpu.json";
import { cpi } from "./data/cpi.json";
import './app.css';

const renderScatterPointLabel = ({
    x, y, width, height, value
}) => {
    return (
      <g>
        <text 
            x={x + width / 2} 
            y={y} 
            textAnchor="middle" 
            dominantBaseline="middle"
            style={{ fontSize: "8px" }}
        >
          {value}
        </text>
      </g>
    );
}

const App = () => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const latestCpiNum = cpi['2024']['11'];
        const sortedGpus = gpus.sort((a,b) => a.release_date > b.release_date);
        const newData = sortedGpus.map(gpu => {
            const year = parseInt(gpu.release_date.slice(0, 4));
            const month = parseInt(gpu.release_date.slice(5, 7));

            const cpiNum = cpi[year][month];
            const cpiFactor = latestCpiNum / cpiNum;
            const msrpInflationAdjusted = gpu.msrp * cpiFactor;
            const calcPerf = (msrp, score) => (msrp / score).toFixed(3)
            const pricePerPerformanceUnit = calcPerf(gpu.msrp, gpu['3dmark_time_spy_avg_score']);
            const pricePerPerformanceUnitInfationAdjusted = calcPerf(msrpInflationAdjusted, gpu['3dmark_time_spy_avg_score']);

            return {
                model: gpu.model,
                year,
                msrp: gpu.msrp,
                msrpInflationAdjusted,
                pricePerPerformanceUnit,
                pricePerPerformanceUnitInfationAdjusted,
            }
        })
        setData(newData)
        console.log(newData)
    }, []);


    return (
        <div className='app'>
            <ResponsiveContainer width="100%" height={900}>
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 40,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis 
                        type="number" 
                        dataKey="year" 
                        name="Release Year" 
                        domain={[2010, 2024]}
                    />
                    <YAxis 
                        type="number" 
                        dataKey="pricePerPerformanceUnitInfationAdjusted" 
                        name="Price per unit of performance (CPI Inflation Adjusted)" 
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="A school" data={data} fill="#8884d8">
                        <LabelList dataKey="model" content={renderScatterPointLabel} />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>

            <p>Sources:</p>
            <ul>
                <li>
                    <a 
                        href="https://www.3dmark.com/search#advanced?test=spy%20P&cpuId=&gpuId=1290&gpuCount=0&gpuType=ALL&deviceType=ALL&storageModel=ALL&showRamDisks=false&memoryChannels=0&country=&scoreType=overallScore&hofMode=false&showInvalidResults=false&freeParams=&minGpuCoreClock=&maxGpuCoreClock=&minGpuMemClock=&maxGpuMemClock=&minCpuClock=&maxCpuClock="
                    >
                        3DMark Time Spy benchmark scores
                    </a>
                </li>
                <li>
                    <a 
                        href="https://data.bls.gov"
                    >
                        Consumer Price Index for All Urban Consumers (CPI-U) All Items (Series Id: CUUR0000SA0)
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default App;