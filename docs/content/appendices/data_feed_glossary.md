The page contains a listing of _properties_ which can be observed. This metadata can be downloaded using:

* the [```AlertManager.getProperties```](/content/sdk/lib?id=alertmanagergetproperties) and [```AlertManager.getOperators```](/content/sdk/lib?id=alertmanagergetproperties) functions, or
* the [```/alert/targets/properties```](/content/api/paths?id=get-alerttargetsproperties) and [```/alert/operators```](/content/api/paths?id=get-alerttargetsproperties) endpoints.

## Quotes: Prices & Volume

| Property ID | Description | Time Frame | Valid Operators |
| :- | :--- | :--- | :--: |
| 1 | Last | -- | >, <, >, < |
| 3 | High | -- | >, <, >, < |
| 4 | Low | -- | >, <, >, < |
| 2 | Open | -- | >, <, >, < |
| 5 | Close | -- | >, <, >, < |
| 7 | Price Change | -- | >, <, >, < |
| 6 | Percent Change | -- | >, <, >, < |
| 8 | Volume | -- | >, <, >, < |

## Quotes: Prior Day Prices

| Property ID | Description | Time Frame | Valid Operators |
| :- | :--- | :--- | :--: |
| 176 | Prev High | -- | >, <, >, < |
| 177 | Prev Low | -- | >, <, >, < |
| 178 | Prev Open | -- | >, <, >, < |
| 175 | Prev Close | -- | >, <, >, < |
| 180 | Prev High (2D Ago) | -- | >, <, >, < |
| 181 | Prev Low (2D Ago) | -- | >, <, >, < |
| 182 | Prev Open (2D Ago) | -- | >, <, >, < |
| 179 | Prev Close (2D Ago) | -- | >, <, >, < |

## Quotes: New Highs & Lows

| Property ID | Description | Time Frame | Valid Operators |
| :- | :--- | :--- | :--: |
| 126 | Today's High | -- | makes new, within % |
| 127 | Today's Low | -- | makes new, within % |

## Technicals: Prices & Volume

| Property ID | Description | Time Frame | Valid Operators |
| :- | :--- | :--- | :--: |
| 167 | Price Change | 5-Day | >, <, >, < |
| 168 | Price Change | 1-Month | >, <, >, < |
| 169 | Price Change | 3-Month | >, <, >, < |
| 170 | Price Change | 6-Month | >, <, >, < |
| 171 | Price Change | 9-Month | >, <, >, < |
| 172 | Price Change | 52-Week | >, <, >, < |
| 173 | Price Change | YTD | >, <, >, < |
| 174 | Price Change | 2-Year | >, <, >, < |
| 159 | Percent Change | 5-Day | >, <, >, < |
| 160 | Percent Change | 1-Month | >, <, >, < |
| 161 | Percent Change | 3-Month | >, <, >, < |
| 162 | Percent Change | 6-Month | >, <, >, < |
| 163 | Percent Change | 9-Month | >, <, >, < |
| 164 | Percent Change | 52-Week | >, <, >, < |
| 165 | Percent Change | YTD | >, <, >, < |
| 166 | Percent Change | 2-Year | >, <, >, < |
| 183 | Volume % Change | -- | >, < |

## Technicals: Technical Analysis

| Property ID | Description | Time Frame | Valid Operators |
| :- | :--- | :--- | :--: |
| 15 | Average Volume | 5-Day | >, <, >, < |
| 16 | Average Volume | 20-Day | >, <, >, < |
| 17 | Average Volume | 50-Day | >, <, >, < |
| 18 | Average Volume | 100-Day | >, <, >, < |
| 19 | Average Volume | 200-Day | >, <, >, < |
| 20 | Average Volume | YTD | >, <, >, < |
| 77 | Historic Volatility | 9-Day | >, <, >, < |
| 78 | Historic Volatility | 14-Day | >, <, >, < |
| 79 | Historic Volatility | 20-Day | >, <, >, < |
| 80 | Historic Volatility | 50-Day | >, <, >, < |
| 81 | Historic Volatility | 100-Day | >, <, >, < |
| 82 | MACD Oscillator | 9-Day | >, <, >, < |
| 83 | MACD Oscillator | 14-Day | >, <, >, < |
| 84 | MACD Oscillator | 20-Day | >, <, >, < |
| 85 | MACD Oscillator | 50-Day | >, <, >, < |
| 86 | MACD Oscillator | 100-Day | >, <, >, < |
| 9 | Moving Average | 5-Day | >, <, >, < |
| 10 | Moving Average | 20-Day | >, <, >, < |
| 11 | Moving Average | 50-Day | >, <, >, < |
| 12 | Moving Average | 100-Day | >, <, >, < |
| 13 | Moving Average | 200-Day | >, <, >, < |
| 14 | Moving Average | YTD | >, <, >, < |
| 72 | Percent R | 9-Day | >, <, >, < |
| 73 | Percent R | 14-Day | >, <, >, < |
| 74 | Percent R | 20-Day | >, <, >, < |
| 75 | Percent R | 50-Day | >, <, >, < |
| 76 | Percent R | 100-Day | >, <, >, < |
| 21 | Raw Stochastic | 9-Day | >, <, >, < |
| 22 | Raw Stochastic | 14-Day | >, <, >, < |
| 23 | Raw Stochastic | 20-Day | >, <, >, < |
| 24 | Raw Stochastic | 50-Day | >, <, >, < |
| 25 | Raw Stochastic | 100-Day | >, <, >, < |
| 67 | Relative Strength | 9-Day | >, <, >, < |
| 68 | Relative Strength | 14-Day | >, <, >, < |
| 69 | Relative Strength | 20-Day | >, <, >, < |
| 70 | Relative Strength | 50-Day | >, <, >, < |
| 71 | Relative Strength | 100-Day | >, <, >, < |
| 87 | Standard Deviation | -- | >, < |
| 57 | Stochastic %D | 9-Day | >, <, >, < |
| 58 | Stochastic %D | 14-Day | >, <, >, < |
| 59 | Stochastic %D | 20-Day | >, <, >, < |
| 60 | Stochastic %D | 50-Day | >, <, >, < |
| 61 | Stochastic %D | 100-Day | >, <, >, < |
| 52 | Stochastic %K | 9-Day | >, <, >, < |
| 53 | Stochastic %K | 14-Day | >, <, >, < |
| 54 | Stochastic %K | 20-Day | >, <, >, < |
| 55 | Stochastic %K | 50-Day | >, <, >, < |
| 56 | Stochastic %K | 100-Day | >, <, >, < |
| 62 | True Range | 9-Day | >, <, >, < |
| 63 | True Range | 14-Day | >, <, >, < |
| 64 | True Range | 20-Day | >, <, >, < |
| 65 | True Range | 50-Day | >, <, >, < |
| 66 | True Range | 100-Day | >, <, >, < |
| 88 | Weighted Alpha | -- | >, < |

## Technicals: Support & Resistance

| Property ID | Description | Time Frame | Valid Operators |
| :- | :--- | :--- | :--: |
| 121 | Pivot Point | -- | >, <, >, < |
| 122 | Support L1 | -- | >, <, >, < |
| 123 | Support L2 | -- | >, <, >, < |
| 124 | Resistance L1 | -- | >, <, >, < |
| 125 | Resistance L2 | -- | >, <, >, < |

## Opinions: Barchart Opinion

| Property ID | Description | Side | Valid Operators |
| :- | :--- | :--- | :--: |
| 108 | Overall Opinion | -- | = |
| 220 | Overall Strength | -- | = |
| 221 | Overall Direction | -- | = |
| 100 | Overall Opinion % | Buy | >, < |
| 102 | Overall Opinion % | Sell | >, < |
| 118 | Yesterday's Opinion | -- | = |
| 109 | Yesterday's Opinion % | Buy | >, < |
| 111 | Yesterday's Opinion % | Sell | >, < |
| 119 | Last Week's Opinion | -- | = |
| 112 | Last Week's Opinion % | Buy | >, < |
| 114 | Last Week's Opinion % | Sell | >, < |
| 120 | Last Month's Opinion | -- | = |
| 115 | Last Month's Opinion % | Buy | >, < |
| 117 | Last Month's Opinion % | Sell | >, < |
| 106 | Short-Term Opinion | -- | = |
| 91 | Short-Term Opinion % | Buy | >, < |
| 93 | Short-Term Opinion % | Sell | >, < |
| 107 | Medium-Term Opinion | -- | = |
| 94 | Medium-Term Opinion % | Buy | >, < |
| 96 | Medium-Term Opinion % | Sell | >, < |
| 105 | Long-Term Opinion | -- | = |
| 97 | Long-Term Opinion % | Buy | >, < |
| 99 | Long-Term Opinion % | Sell | >, < |

## Opinions: Short-Term Indicators

| Property ID | Description | Signal Type | Valid Operators |
| :- | :--- | :--- | :--: |
| 29 | 20 Day Mov Avg | Signal | = |
| 131 | 20 Day Mov Avg | Strength | = |
| 144 | 20 Day Mov Avg | Direction | = |
| 202 | 20 Day Mov Avg | Makes New Signal | = |
| 30 | 20-50 Day MACD | Signal | = |
| 132 | 20-50 Day MACD | Strength | = |
| 145 | 20-50 Day MACD | Direction | = |
| 205 | 20-50 Day MACD | Makes New Signal | = |
| 51 | 20-100 Day MACD | Signal | = |
| 140 | 20-100 Day MACD | Strength | = |
| 153 | 20-100 Day MACD | Direction | = |
| 206 | 20-100 Day MACD | Makes New Signal | = |
| 190 | 20-200 Day MACD | Signal | = |
| 191 | 20-200 Day MACD | Strength | = |
| 192 | 20-200 Day MACD | Direction | = |
| 214 | 20-200 Day MACD | Makes New Signal | = |

## Opinions: Long-Term Indicators

| Property ID | Description | Signal Type | Valid Operators |
| :- | :--- | :--- | :--: |
| 36 | 100 Day Mov Avg | Signal | = |
| 138 | 100 Day Mov Avg | Strength | = |
| 151 | 100 Day Mov Avg | Direction | = |
| 204 | 100 Day Mov Avg | Makes New Signal | = |
| 184 | 150 Day Mov Avg | Signal | = |
| 185 | 150 Day Mov Avg | Strength | = |
| 186 | 150 Day Mov Avg | Direction | = |
| 218 | 150 Day Mov Avg | Makes New Signal | = |
| 187 | 200 Day Mov Avg | Signal | = |
| 188 | 200 Day Mov Avg | Strength | = |
| 189 | 200 Day Mov Avg | Direction | = |
| 219 | 200 Day Mov Avg | Makes New Signal | = |
| 199 | 100-200 Day MACD | Signal | = |
| 200 | 100-200 Day MACD | Strength | = |
| 201 | 100-200 Day MACD | Direction | = |
| 217 | 100-200 Day MACD | Makes New Signal | = |

## Opinions: Legacy Indicators

| Property ID | Description | Signal Type | Valid Operators |
| :- | :--- | :--- | :--: |
| 27 | 7-Day ADX | Signal | = |
| 129 | 7-Day ADX | Strength | = |
| 223 | 9-18 Day MACD | Signal | = |
| 142 | 7-Day ADX | Direction | = |
| 224 | 9-18 Day MACD | Strength | = |
| 225 | 9-18 Day MACD | Direction | = |
| 226 | 9-18 Day MACD | Makes New Signal | = |
| 208 | 7-Day ADX | Makes New Signal | = |
| 28 | 10-8 Day MA HiLo | Signal | = |
| 130 | 10-8 Day MA HiLo | Strength | = |
| 143 | 10-8 Day MA HiLo | Direction | = |
| 209 | 10-8 Day MA HiLo | Makes New Signal | = |
| 31 | 20-Day Bollinger | Signal | = |
| 133 | 20-Day Bollinger | Strength | = |
| 146 | 20-Day Bollinger | Direction | = |
| 210 | 20-Day Bollinger | Makes New Signal | = |
| 32 | 40-Day CCI | Signal | = |
| 134 | 40-Day CCI | Strength | = |
| 147 | 40-Day CCI | Direction | = |
| 211 | 40-Day CCI | Makes New Signal | = |
| 34 | 50-Day Parabolic | Signal | = |
| 149 | 50-Day Parabolic | Direction | = |
| 136 | 50-Day Parabolic | Strength | = |
| 213 | 50-Day Parabolic | Makes New Signal | = |
| 35 | 60-Day CCI | Signal | = |
| 137 | 60-Day CCI | Strength | = |
| 150 | 60-Day CCI | Direction | = |
| 212 | 60-Day CCI | Makes New Signal | = |
