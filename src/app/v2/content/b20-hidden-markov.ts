import type { V2Lesson } from "../lib/types";

// -- Figure: 120 observasi + pita state sejati vs Viterbi (seed 20) ---------
const HMM_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Pita state sejati vs hasil Viterbi di atas deret observasi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="240" x2="530" y2="240"/>
<line x1="60" y1="205" x2="530" y2="205"/><line x1="60" y1="170" x2="530" y2="170"/>
<line x1="60" y1="135" x2="530" y2="135"/><line x1="60" y1="100" x2="530" y2="100"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="243">-4</text><text x="54" y="173">0</text><text x="54" y="103">4</text>
</g>
<rect x="58.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="62.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="65.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="69.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="73.8" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="77.8" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="81.7" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="85.7" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="89.6" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="93.6" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="97.5" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="101.5" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="105.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="109.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="113.3" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="117.3" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="121.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="125.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="129.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="133.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="137.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="141.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="144.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="148.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="152.8" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="156.8" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="160.7" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="164.7" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="168.6" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="172.6" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="176.5" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="180.5" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="184.4" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="188.4" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="192.3" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="196.3" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="200.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="204.2" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="208.1" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="212.1" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="216.0" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="220.0" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="223.9" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="227.9" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="231.8" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="235.8" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="239.7" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="243.7" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="247.6" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="251.6" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="255.5" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="259.5" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="263.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="267.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="271.3" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="275.3" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="279.2" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="283.2" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="287.1" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="291.1" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="295.0" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="298.9" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="302.9" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="306.8" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="310.8" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="314.7" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="318.7" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="322.6" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="326.6" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="330.5" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="334.5" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="338.4" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="342.4" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="346.3" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="350.3" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="354.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="358.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="362.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="366.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="370.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="374.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="377.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="381.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="385.8" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="389.8" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="393.7" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="397.7" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="401.6" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="405.6" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="409.5" y="28" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="413.5" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="417.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="421.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="425.3" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="429.3" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="433.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="437.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="441.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="445.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="449.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="453.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="456.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="460.9" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="464.8" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="468.8" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="472.7" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="476.7" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="480.6" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="484.6" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="488.5" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="492.5" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="496.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="500.4" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="504.3" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="508.3" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="512.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="516.2" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="520.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="524.1" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="528.0" y="28" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="58.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="62.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="65.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="69.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="73.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="77.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="81.7" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="85.7" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="89.6" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="93.6" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="97.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="101.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="105.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="109.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="113.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="117.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="121.2" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="125.2" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="129.1" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="133.1" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="137.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="141.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="144.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="148.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="152.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="156.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="160.7" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="164.7" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="168.6" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="172.6" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="176.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="180.5" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="184.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="188.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="192.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="196.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="200.2" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="204.2" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="208.1" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="212.1" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="216.0" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="220.0" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="223.9" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="227.9" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="231.8" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="235.8" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="239.7" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="243.7" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="247.6" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="251.6" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="255.5" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="259.5" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="263.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="267.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="271.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="275.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="279.2" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="283.2" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="287.1" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="291.1" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="295.0" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="298.9" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="302.9" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="306.8" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="310.8" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="314.7" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="318.7" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="322.6" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="326.6" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="330.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="334.5" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="338.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="342.4" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="346.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="350.3" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="354.2" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="358.2" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="362.1" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="366.1" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="370.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="374.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="377.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="381.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="385.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="389.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="393.7" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="397.7" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="401.6" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="405.6" y="58" width="4.3" height="24" fill="var(--c2)" opacity="0.55"/>
<rect x="409.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="413.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="417.4" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="421.4" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="425.3" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="429.3" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="433.2" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="437.2" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="441.1" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="445.1" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="449.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="453.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="456.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="460.9" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="464.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="468.8" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="472.7" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="476.7" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="480.6" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="484.6" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="488.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="492.5" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="496.4" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="500.4" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="504.3" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="508.3" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="512.2" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="516.2" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="520.1" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="524.1" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<rect x="528.0" y="58" width="4.3" height="24" fill="var(--c1)" opacity="0.55"/>
<polyline points="60.0,134.9 63.9,150.4 67.9,164.6 71.8,171.8 75.8,139.7 79.7,153.8 83.7,175.0 87.6,170.7 91.6,155.7 95.5,160.2 99.5,134.5 103.4,155.3 107.4,200.6 111.3,168.7 115.3,214.0 119.2,156.5 123.2,197.8 127.1,128.1 131.1,168.7 135.0,202.3 139.0,129.7 142.9,208.1 146.9,157.8 150.8,137.9 154.8,196.6 158.7,166.7 162.7,137.5 166.6,174.5 170.6,164.8 174.5,148.3 178.5,139.2 182.4,180.7 186.4,172.1 190.3,230.2 194.3,199.4 198.2,153.8 202.2,151.8 206.1,218.4 210.1,189.1 214.0,186.9 218.0,174.3 221.9,194.9 225.9,229.3 229.8,186.7 233.8,191.3 237.7,163.7 241.7,179.0 245.6,179.9 249.6,223.7 253.5,168.5 257.5,195.7 261.4,186.0 265.4,149.4 269.3,178.3 273.3,166.8 277.2,188.6 281.2,186.9 285.1,196.1 289.1,152.6 293.0,200.8 297.0,211.4 300.9,168.9 304.9,168.8 308.8,188.8 312.8,189.8 316.7,216.6 320.7,195.8 324.6,188.0 328.6,146.1 332.5,149.7 336.5,199.5 340.4,163.4 344.4,189.3 348.3,203.9 352.3,174.3 356.2,181.6 360.2,168.6 364.1,172.8 368.1,169.6 372.0,149.9 376.0,139.3 379.9,144.3 383.9,157.6 387.8,158.8 391.8,145.5 395.7,202.3 399.7,185.0 403.6,202.7 407.6,177.3 411.5,170.3 415.5,170.6 419.4,154.3 423.4,148.7 427.3,121.3 431.3,146.3 435.2,137.9 439.2,158.4 443.1,128.8 447.1,140.3 451.0,149.3 455.0,164.5 458.9,188.5 462.9,134.8 466.8,144.3 470.8,144.3 474.7,132.4 478.7,156.7 482.6,150.6 486.6,156.0 490.5,176.8 494.5,177.3 498.4,119.8 502.4,148.6 506.3,164.6 510.3,147.4 514.2,166.1 518.2,178.8 522.1,160.0 526.1,158.3 530.0,152.4" fill="none" stroke="var(--chart-text)" stroke-width="1" opacity="0.7"/>
ACC: 0.875

<g font-size="11" font-family="var(--font-ui)">
<text x="40" y="45" fill="var(--text)">sejati</text>
<text x="40" y="75" fill="var(--text)">viterbi</text>
<rect x="80" y="92" width="14" height="14" fill="var(--c1)" opacity="0.55"/><text x="100" y="104" fill="var(--text)">bull</text>
<rect x="150" y="92" width="14" height="14" fill="var(--c2)" opacity="0.55"/><text x="170" y="104" fill="var(--text)">bear</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="60" y="16">return harian</text><text x="400" y="290">waktu (120 hari pertama, data sintetis)</text>
</g>
</svg>`;

export const b20: V2Lesson = {
  slug: "b20-hidden-markov",
  track: "Probabilitas",
  module: "Proses Stokastik",
  title: "Hidden Markov Models: Status Tersembunyi di Balik Data (regime pasar, pola fraud)",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang benar 95% waktu — dan salah besar 5% sisanya",
      prose: [
        "Tim kuantitatif sebuah sekuritas memakai model satu-rezim untuk memprediksi return harian IHSG: return besok = 0,05% + noise. Backtest 5 tahun: 95% hari prediksinya masuk akal. Tetapi setiap beberapa bulan, selalu ada 2–3 minggu di mana model itu salah BESAR dan konsisten — memprediksi +0,05% sementara pasar minus 2% hari demi hari. Setiap kali, tim menyalahkan black swan, lalu kembali memakai model yang sama. Black swan-nya datang terlalu teratur untuk disebut angsa hitam.",
        "Twist-nya: yang terjadi bukan serangkaian kejadian tak terduga — melainkan DUA REZIM yang bergantian: rezim tenang (return rata-rata +0,08%, volatilitas rendah) dan rezim stres (return rata-rata −0,15%, volatilitas tinggi). Model satu-rezim memotret gabungan keduanya menjadi satu angka hambar (+0,05%) yang tidak mewakili rezim mana pun. Ia benar 95% waktu karena 95% waktu pasar memang tenang — dan ia buta total pada 5% waktu yang justru menentukan hidup-mati portofolio.",
        "Lesson ini tentang Hidden Markov Model (berdasar tutorial hmmlearn): model yang mengasumsikan ada STATUS TERSEMBUNYI (rezim pasar, fase fraud) yang menggerakkan data yang terlihat. Kamu tidak pernah melihat rezimnya — tetapi dari pola return, kamu bisa menyimpulkannya. Tiga algoritma legendaris menanti: forward (menilai), Viterbi (mendekode), Baum-Welch (belajar).",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Risiko hidup di pergantian rezim: korelasi yang melonjak saat krisis, default yang bergerombol, pola fraud yang bermetamorfosis. Model satu-rezim meremehkan risiko tepat saat risiko itu penting — karena ia merata-ratakan masa tenang dan masa krisis menjadi satu kebohongan yang rapi.",
      },
      reference: "HMM = ada state tersembunyi yang menggerakkan observasi; tugas kita menyimpulkan state dari observasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menulis komponen HMM (state, transisi, emisi, distribusi awal) dan joint probability-nya; (2) menjalankan algoritma forward untuk menghitung likelihood; (3) menjalankan Viterbi untuk mendekode urutan state paling mungkin; (4) menjelaskan ide Baum-Welch/EM untuk mengestimasi parameter; (5) memutuskan kapan HMM tepat dan kapan tidak.",
        "Rutenya: cerita, bekal ringkas, dua konsep (anatomi HMM; tiga masalah: forward, Viterbi, Baum-Welch), lab Pyodide (mesin forward+Viterbi), chart pita state dengan panduan baca, peta keputusan, mini-case pola fraud, kuis, rangkuman. Estimasi 52 menit; lab-nya sekitar 15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Rantai Markov: sistem dengan state TERLIHAT yang berpindah menurut matriks transisi — peluang state besok hanya tergantung state hari ini (sifat Markov). HMM menaikkan satu level: state-nya TERSEMBUNYI; yang terlihat hanyalah observasi yang dipancarkan tiap state menurut distribusi emisi. Tugas HMM adalah inferensi terbalik: dari observasi, tebak state-nya.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: rantai Markov = kamu melihat dadu yang dipakai bandar tiap ronde. HMM = kamu hanya melihat ANGKA yang keluar, dan harus menebak kapan bandar mengganti dadu curang dengan dadu jujur.",
      ],
      reference: "Bekal: rantai Markov = state terlihat + transisi. HMM = state tersembunyi + observasi (emisi).",
    },
    {
      id: "konsep-anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi HMM — Si Dalang di Balik Layar",
      prose: [
        "Definisi: HMM terdiri dari empat komponen. (1) State tersembunyi S_t ∈ {1..K} — rezim yang tidak terlihat (bull/bear; normal/fraud). (2) Matriks transisi A: A_ij = P(S_{t+1}=j | S_t=i) — seberapa betah tiap rezim dan seberapa sering pindah. (3) Distribusi emisi B: P(O_t | S_t) — tiap state memancarkan observasi menurut distribusinya sendiri (bull: return ~ Normal(+0,8; 1); bear: return ~ Normal(−0,8; 1)). (4) Distribusi awal pi: P(S_1). Joint probability-nya: P(S, O) = pi(S_1) · B(O_1|S_1) · Π_t A(S_t→S_{t+1}) · B(O_{t+1}|S_{t+1}) — rantai Markov untuk state, emisi menempel di tiap langkah.",
        "Kepribadiannya: HMM seperti teater boneka — penonton (kamu) hanya melihat boneka (observasi: return harian), tetapi cerita digerakkan dalang tak terlihat (rezim pasar) yang sesekali mengganti lakon. Dua dalang berbeda bisa memainkan boneka yang mirip pada satu adegan (return +1% bisa dari bull atau bear) — tetapi POLA adegan-adegan mengungkap siapa dalangnya. Tugasmu bukan menebak satu adegan, melainkan membaca seluruh pertunjukan.",
        "Kapan memakai: (1) ada REZIM yang diduga menggerakkan data: pasar tenang vs krisis; nasabah normal vs fraud; mesin sehat vs aus; (2) transisi rezim bersifat Markovian (cukup tahu rezim kini untuk menebak besok); (3) tiap rezim punya pola observasi yang BERBEDA (bila emisi bull dan bear identik, tidak ada yang bisa disimpulkan). Jumlah state K adalah pilihan desain: mulai dari 2–3 yang bisa diinterpretasi, bukan 10 yang mistis.",
      ],
      formula: String.raw`P(S_{1:T}, O_{1:T}) = \pi_{S_1} \, b_{S_1}(O_1) \prod_{t=1}^{T-1} a_{S_t S_{t+1}} \, b_{S_{t+1}}(O_{t+1})`,
      formulaNote: "S = urutan state tersembunyi; O = urutan observasi; pi = peluang awal; a_ij = peluang transisi i→j; b_j(O) = densitas emisi state j. Contoh angka lab: A = [[0,90; 0,10],[0,15; 0,85]] — bull betah (90% bertahan), bear juga betah (85%); emisi bull Normal(0,8; 1), bear Normal(−0,8; 1). Perhatikan: return 0 bisa dipancarkan KEDUA state (distribusinya tumpang tindih!) — maka satu observasi tidak cukup; butuh RANGKAIAN untuk menyimpulkan rezim.",
      tasks: [],
      note: {
        title: "🚨 Mitos: HMM menebak state dari satu observasi",
        type: "pitfall",
        body: "Yang benar: satu return harian tidak bisa menentukan rezim — distribusi emisi tumpang tindih. Kekuatan HMM justru pada KONTEKS TEMPORAL: 10 return negatif beruntun hampir pasti bear, walau tiap return individual ambigu. Menilai HMM dari akurasi per-titik tanpa melihat urutan adalah salah paham fundamental.",
      },
      hints: [
        "💡 Intuisi: A mengontrol KEBETAHAN rezim. A_ii dekat 1 = rezim awet (krisis berminggu-minggu); A_ii kecil = rezim genit (berubah tiap hari). Sebelum fitting, tanyakan: seberapa awet rezim yang kucari? Jawabannya membimbing inisialisasi A.",
      ],
      reference: "Empat komponen: pi, A (transisi), B (emisi), K state. Joint = Markov × emisi.",
    },
    {
      id: "konsep-tiga-masalah",
      eyebrow: "Langkah 4 · Konsep",
      title: "Tiga masalah legendaris: forward, Viterbi, Baum-Welch",
      prose: [
        "Masalah 1 — EVALUASI (forward algorithm): berapa P(O | model)? Hitung dengan pemrograman dinamis: alpha_t(j) = P(O_1..O_t, S_t=j) — peluang observasi sejauh ini DAN berakhir di state j. Rekursi: alpha_t(j) = b_j(O_t) · Σ_i alpha_{t−1}(i)·a_ij. Jumlahkan alpha_T atas semua state = likelihood total. Tanpa trik ini, menjumlah atas K^T urutan state mustahil; dengan ini, O(T·K²). Praktik numerik: kerjakan dalam skala LOG dengan log-sum-exp — peluang menjadi superkecil dan underflow dalam ratusan langkah.",
        "Masalah 2 — DEKODE (Viterbi): apa URUTAN STATE paling mungkin? Mirip forward, tetapi jumlah (Σ) diganti MAKSIMUM: delta_t(j) = peluang jalur TERBAIK yang berakhir di j. Simpan juga backpointer psi_t(j) = dari state mana jalur terbaik itu datang. Di akhir, telusuri mundur dari state terbaik — itulah jalur Viterbi. Inilah yang dipakai lab untuk mewarnai pita: 85,5% cocok dengan rezim sejati.",
        "Masalah 3 — BELAJAR (Baum-Welch = EM untuk HMM): bagaimana mengestimasi A, B, pi dari data TANPA label state? E-step: hitung peluang posterior tiap state di tiap waktu (forward-backward); M-step: update parameter seolah state itu diketahui (rata-rata berbobot). Ulangi sampai konvergen. Peringatan jujur: EM hanya menjamin optimum LOKAL — inisialisasi penting, dan label state bisa TERTUKAR antar-run (state 0 di run A = state 1 di run B); interpretasi manual wajib.",
      ],
      formula: String.raw`\alpha_t(j) = b_j(O_t) \sum_{i=1}^{K} \alpha_{t-1}(i) \, a_{ij}, \qquad \delta_t(j) = b_j(O_t) \max_{i} \, \delta_{t-1}(i) \, a_{ij}`,
      formulaNote: "alpha = forward (penjumlahan: total peluang); delta = Viterbi (maksimum: jalur terbaik). Satu-satunya beda: Σ vs max — tetapi maknanya jauh: forward menjawab seberapa COCOK model dengan data (untuk perbandingan model), Viterbi menjawab REZIM APA yang paling mungkin terjadi kapan (untuk keputusan). Keduanya O(T·K²) dan keduanya wajib dalam log-space. Baum-Welch memakai keduanya di E-step-nya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: Viterbi memberi peluang tiap state di tiap waktu",
        type: "pitfall",
        body: "Yang benar: Viterbi memberi SATU jalur terbaik (pemenang), bukan distribusi peluang. Bila kamu butuh ketidakpastian (berapa peluang sedang bear HARI INI?) — pakai forward-backward (smoothing): gamma_t(j) = P(S_t=j | seluruh observasi). Viterbi untuk keputusan tunggal; smoothing untuk kehati-hatian.",
      },
      hints: [
        "💡 Intuisi: forward = akuntan (menjumlah semua kemungkinan); Viterbi = detektif (mengejar satu tersangka terbaik); Baum-Welch = pelatih (memperbaiki model dari data tanpa label). Tiga peran, satu panggung.",
        "💡 Intuisi praktis: selalu kerjakan dalam log-space. Peluang 400 observasi ≈ (0,5)^400 ≈ 10^(−120) — di bawah batas float terkecil (~10^(−308)? masih muat, tetapi perkalian berantai dengan transisi kecil tidak). log-sum-exp adalah sabuk pengaman wajib.",
      ],
      reference: "Forward = evaluasi (Σ). Viterbi = dekode (max). Baum-Welch = EM untuk belajar parameter.",
    },
    {
      id: "lab-hmm",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun mesin forward & Viterbi",
      prose: [
        "Waktunya jadi detektif rezim. Data di bawah mensimulasikan 400 return harian dari HMM 2-state: bull (mean +0,8) dan bear (mean −0,8), dengan transisi A = [[0,90; 0,10],[0,15; 0,85]]. State sejatinya disimpan (untuk validasi) tetapi TIDAK BOLEH diintip saat inferensi — seperti dalang yang tak terlihat. Fungsi logsumexp dan log-emisi sudah disediakan. Tugasmu: tulis langkah forward, hitung log-likelihood, tulis langkah Viterbi, lalu ukur akurasinya.",
        "Coba: setelah lolos, ubah mu = [0.8, -0.8] menjadi [0.2, -0.2] (emisi nyaris identik). Apa yang terjadi pada akurasi Viterbi? Itulah batas fundamental HMM: bila dalang memainkan boneka yang sama persis, tidak ada detektif yang bisa membedakannya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi langkah forward: `log_alpha[t, j] = ...` memakai logB, logA, dan logsumexp" },
        { id: "t2", text: "Hitung `loglik` = log-sum-exp dari baris terakhir log_alpha" },
        { id: "t3", text: "Lengkapi langkah Viterbi: `delta[t, j] = ...` memakai cand dan psi" },
        { id: "t4", text: "Hitung `acc` = fraksi path Viterbi yang cocok dengan state sejati" },
      ],
      requires: ["numpy"],
      expected: "loglik=-650.18\nacc=0.855",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(20)
A = np.array([[0.90, 0.10], [0.15, 0.85]])   # transisi: bull betah, bear betah
pi0 = np.array([0.6, 0.4])
mu = np.array([0.8, -0.8])                    # emisi: bull +, bear -
sd = np.array([1.0, 1.0])
Tlen = 400
states = np.empty(Tlen, dtype=int)            # SEJATI (validasi saja!)
obs = np.empty(Tlen)
states[0] = 0 if rng.random() < pi0[0] else 1
obs[0] = rng.normal(mu[states[0]], sd[states[0]])
for t in range(1, Tlen):
    states[t] = 0 if rng.random() < A[states[t-1], 0] else 1
    obs[t] = rng.normal(mu[states[t]], sd[states[t]])

def log_gauss(x, m, s):
    return -0.5*((x-m)/s)**2 - np.log(s) - 0.5*np.log(2*np.pi)
def logsumexp(v):
    m = v.max()
    return m + np.log(np.exp(v-m).sum())
logB = np.array([log_gauss(obs, mu[k], sd[k]) for k in range(2)]).T
logA = np.log(A)

# TULIS KODEMU: forward
log_alpha = np.zeros((Tlen, 2))
log_alpha[0] = np.log(pi0) + logB[0]
for t in range(1, Tlen):
    for j in range(2):
        log_alpha[t, j] = ...
loglik = ...

# TULIS KODEMU: viterbi
delta = np.zeros((Tlen, 2)); psi = np.zeros((Tlen, 2), dtype=int)
delta[0] = np.log(pi0) + logB[0]
for t in range(1, Tlen):
    for j in range(2):
        cand = delta[t-1] + logA[:, j]
        psi[t, j] = int(np.argmax(cand))
        delta[t, j] = ...
path = np.zeros(Tlen, dtype=int)
path[-1] = int(np.argmax(delta[-1]))
for t in range(Tlen-2, -1, -1):
    path[t] = psi[t+1, path[t+1]]
acc = ...

print(f"loglik={loglik:.2f}")
print(f"acc={acc:.3f}")`,
        lockLines: 28,
        solution: `import numpy as np
rng = np.random.default_rng(20)
A = np.array([[0.90, 0.10], [0.15, 0.85]])   # transisi: bull betah, bear betah
pi0 = np.array([0.6, 0.4])
mu = np.array([0.8, -0.8])                    # emisi: bull +, bear -
sd = np.array([1.0, 1.0])
Tlen = 400
states = np.empty(Tlen, dtype=int)            # SEJATI (validasi saja!)
obs = np.empty(Tlen)
states[0] = 0 if rng.random() < pi0[0] else 1
obs[0] = rng.normal(mu[states[0]], sd[states[0]])
for t in range(1, Tlen):
    states[t] = 0 if rng.random() < A[states[t-1], 0] else 1
    obs[t] = rng.normal(mu[states[t]], sd[states[t]])

def log_gauss(x, m, s):
    return -0.5*((x-m)/s)**2 - np.log(s) - 0.5*np.log(2*np.pi)
def logsumexp(v):
    m = v.max()
    return m + np.log(np.exp(v-m).sum())
logB = np.array([log_gauss(obs, mu[k], sd[k]) for k in range(2)]).T
logA = np.log(A)

# TULIS KODEMU: forward
log_alpha = np.zeros((Tlen, 2))
log_alpha[0] = np.log(pi0) + logB[0]
for t in range(1, Tlen):
    for j in range(2):
        log_alpha[t, j] = logB[t, j] + logsumexp(log_alpha[t-1] + logA[:, j])
loglik = float(logsumexp(log_alpha[-1]))

# TULIS KODEMU: viterbi
delta = np.zeros((Tlen, 2)); psi = np.zeros((Tlen, 2), dtype=int)
delta[0] = np.log(pi0) + logB[0]
for t in range(1, Tlen):
    for j in range(2):
        cand = delta[t-1] + logA[:, j]
        psi[t, j] = int(np.argmax(cand))
        delta[t, j] = logB[t, j] + cand[psi[t, j]]
path = np.zeros(Tlen, dtype=int)
path[-1] = int(np.argmax(delta[-1]))
for t in range(Tlen-2, -1, -1):
    path[t] = psi[t+1, path[t+1]]
acc = float(np.mean(path == states))

print(f"loglik={loglik:.2f}")
print(f"acc={acc:.3f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "loglik", value: -650.18, tol: 0.5, label: "`loglik` ≈ −650,18", msg: "Log-likelihood forward — jumlahkan (log-sum-exp) peluang semua jalur." },
          { kind: "equal", task: "t4", name: "acc", value: 0.855, tol: 0.02, label: "`acc` ≈ 0,855", msg: "Viterbi menebak 85,5% rezim dengan benar — tanpa pernah melihat labelnya." },
          { kind: "stdout_matches", task: "t4", pattern: "acc=0\\.8", label: "Ringkasan tercetak", msg: "Baris acc harus tercetak di output." },
        ],
      },
      reference: "Forward = Σ (evaluasi). Viterbi = max (dekode). Keduanya O(T·K²) dalam log-space.",
    },
    {
      id: "chart-pita",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca pita rezim seperti manajer risiko",
      prose: [
        "Chart di bawah menampilkan 120 hari pertama lab-mu: garis = return harian observasi; pita atas = rezim SEJATI (simulasi); pita bawah = rezim hasil VITERBI (tebakan model).",
        "Cara membaca: pita diwarnai per hari — terang = bull, gelap = bear. Bandingkan pita atas dan bawah: segmen yang warnanya sama = Viterbi benar; yang beda = salah. Garis return yang bergerombol di atas/bawah nol biasanya cocok dengan warnanya.",
        "Interpretasi: sebagian besar pita cocok (akurasi 85,5%) — terutama episode bear yang panjang di tengah, di mana return negatif beruntun membuat kesimpulan mudah. Kesalahan menumpuk di BATAS pergantian rezim: beberapa hari pertama setelah pindah, model masih ragu — wajar, karena satu-dua observasi ambigu belum cukup mengubah keyakinan. Pelajaran chart ini: HMM kuat membaca EPISODE, lemah menentukan TANGGAL PASTI pergantian — jangan pakai Viterbi untuk market timing harian, pakailah untuk memahami rezim.",
      ],
      figure: {
        svg: HMM_SVG,
        alt: "Pita rezim sejati vs hasil Viterbi di atas deret return: sebagian besar cocok, kesalahan menumpuk di batas pergantian rezim.",
        caption: "State sejati vs dekode Viterbi, 120 hari pertama (data sintetis lab). Akurasi 85,5%.",
      },
      tasks: [],
      reference: "HMM membaca episode dengan baik; tanggal pergantian selalu kabur beberapa hari.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "HMM atau model lain?",
      prose: [
        "Empat skenario pemilihan model deret waktu:",
        "Skenario 1 — Diduga ada 2–3 rezim diskret yang bergantian (tenang/krisis; normal/fraud) dengan transisi Markovian. → HMM. Alasan: ini definisi masalahnya — state diskret tersembunyi + emisi berbeda per state.",
        "Skenario 2 — State kontinu yang berevolusi mulus (posisi roket, tren inflasi). → Kalman filter / state-space linear. Alasan: HMM memaksa dunia menjadi kotak-kotak diskret; bila realitasnya kontinu dan mulus, state-space kontinu lebih tepat.",
        "Skenario 3 — Label state TERSEDIA untuk sebagian data (misalnya periode krisis yang sudah ditandai). → Model supervised (klasifikasi / Markov switching dengan label) atau HMM semi-supervised. Alasan: jangan buang label mahal — pakai untuk inisialisasi atau validasi; Baum-Welch murni buta label.",
        "Skenario 4 — Tujuannya prediksi observasi besok, bukan interpretasi rezim. → Bandingkan HMM dengan ARIMA/ML langsung pada metrik prediksi. Alasan: HMM unggul di interpretasi; untuk prediksi murni, model yang langsung mengoptimalkan prediksi bisa menang. Pilih dengan validasi, bukan dengan estetika.",
        "Aturan praktis 10 detik: rezim diskret tersembunyi → HMM; state kontinu → Kalman; ada label → supervised/semi; butuh prediksi murni → adu di validasi. Selalu: cek label-switching dan stabilitas antar-run Baum-Welch.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: menambah state sampai likelihood naik terus",
        type: "pitfall",
        body: "Likelihood training SELALU naik dengan K (lebih banyak parameter = fit lebih baik). K=8 pada data 400 titik memberi rezim-rezim mistis yang tidak bisa diinterpretasi dan tidak generalisasi. Pilih K dengan BIC/cross-validasi DAN keterinterpretasian: tiap state harus bisa diceritakan (ini rezim apa?) — bila tidak bisa, K terlalu besar.",
      },
      reference: "K dipilih dengan BIC + cerita. State yang tak bisa diinterpretasi = overfitting.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Fraud yang berganti kostum",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank mendeteksi pola fraud kartu kredit yang bermetamorfosis tiap beberapa minggu: fase A = transaksi kecil berulang (testing kartu), fase B = transaksi besar tunggal (eksekusi), lalu kembali normal. Sistem rule-based ketinggalan 2–3 minggu setiap fase berganti — aturan baru ditulis setelah kerugian terjadi. Tim data mengusulkan HMM 3-state (normal, testing, eksekusi) pada fitur transaksi harian per kartu: frekuensi, rata-rata nominal, rasio transaksi online.",
        "Pertanyaan analisis: (1) Kenapa HMM cocok untuk masalah ini dibanding rule-based atau klasifikasi per-transaksi? (2) Bagaimana memakai Viterbi secara operasional? (3) Apa risiko terbesar implementasi ini?",
        "Pembahasan: (1) Fraud adalah REZIM, bukan transaksi: satu transaksi kecil terlihat normal, tetapi RENTETAN transaksi kecil = fase testing. Klasifikasi per-transaksi buta konteks temporal; rule-based buta terhadap fase yang belum pernah terlihat. HMM membaca episode — tepat level yang dibutuhkan. (2) Jalankan Viterbi (atau forward-backward untuk peluang) tiap malam pada 30 hari terakhir tiap kartu; kartu yang memasuki state testing → naikkan monitoring; yang memasuki eksekusi → blokir + verifikasi. Probabilitas (bukan hard label) memungkinkan threshold berbasis biaya: blokir agresif untuk kartu high-limit. (3) Label-switching dan drift: fase fraud BARU yang belum ada di training tidak punya state — model memaksanya ke state terdekat dan salah. Solusinya: monitoring distribusi emisi (bila observasi makin tidak cocok semua state = ada fase baru), retraining berkala, dan human-in-the-loop untuk anomali tak terklasifikasi.",
        "Catatan: akurasi 85% seperti di lab berarti 15% hari salah rezim — untuk pemblokiran kartu, 15% false alarm tidak bisa diterima. Maka output HMM harus menjadi SKOR yang digabung dengan fitur lain, bukan vonis tunggal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fraud adalah adversarial: pelaku BERADAPTASI membaca pertahananmu. Model statis (rule-based, classifier yang jarang retrain) pasti kedaluwarsa. HMM memberi kerangka untuk pola temporal, tetapi bukan kekebalan: pipeline retraining + deteksi fase baru adalah bagian WAJIB desain, bukan nice-to-have. Model fraud tanpa rencana kedaluwarsa adalah model yang menunggu dikalahkan.",
      },
      reference: "HMM membaca fase fraud; output = skor (bukan vonis); rencana retraining = wajib.",
    },
    {
      id: "konsep-lanjutan",
      eyebrow: "Langkah 9 · Konsep lanjutan",
      title: "Forward-backward, Baum-Welch & label switching — membaca rezim seperti profesional",
      prose: [
        "Viterbi memberimu SATU jalur state paling mungkin — tetapi analis risiko sering butuh pertanyaan yang berbeda: berapa peluang kita sedang di state krisis SEKARANG? Jawabannya adalah forward-backward: gabungkan alpha_t(i) (peluang data sampai t DAN state t = i) dengan beta_t(i) (peluang data setelah t DENGAN SYARAT state t = i). Hasilnya gamma_t(i) = alpha_t(i)·beta_t(i) / normalisasi = P(state t = i | SELURUH data). Contoh angka: deret return harian, HMM 2 state — tenang (sigma 1%) dan krisis (sigma 4%). Pada hari ke-50 dari 100, alpha_50 = [0,6, 0,4] dan beta_50 = [0,5, 1,5] → pembilang [0,30, 0,60], penyebut 0,90 → gamma_50 = [0,33, 0,67]. Jadi peluang hari ke-50 adalah krisis = 67% — memakai data masa depan juga (smoothing), bukan hanya masa lalu (filtering). Bedakan penggunaannya: smoothing untuk analisis historis, filtering untuk keputusan real-time saat ini.",
        "Jebakan klasik: mengambil argmax gamma_t(i) per waktu (marginal decoding) TIDAK sama dengan jalur Viterbi — dan keduanya bisa berbeda. Marginal menjawab tiap waktu secara terpisah: state paling mungkin HARI INI. Viterbi menjawab: jalur KESELURUHAN paling mungkin. Contoh: transisi krisis→tenang sangat jarang (a_21 = 0,01). Marginal bisa berkata hari 50 = krisis (67%) dan hari 51 = tenang (60%) — menyiratkan lompatan yang hampir mustahil. Viterbi, yang menghargai biaya transisi, mungkin mempertahankan krisis di kedua hari. Aturan: butuh narasi rezim yang koheren untuk laporan (kapan krisis mulai dan berakhir) → Viterbi. Butuh peluang ketidakpastian per titik waktu (untuk position sizing) → gamma. Jangan campur keduanya dalam satu angka. Contoh numerik perbedaan: pada data uji 200 hari, marginal decoding memberi 14 pergantian state sedangkan Viterbi memberi 9 — lima pergantian 'hantu' dari marginal adalah artefak mengabaikan biaya transisi. Bila laporanmu mengklaim krisis terjadi 14 kali padahal 5 di antaranya hantu, kredibilitas analisismu yang dipertaruhkan.",
        "Baum-Welch adalah EM untuk HMM: algoritma yang mempelajari A, B, dan pi dari data TANPA label state. E-step: hitung gamma_t(i) dan xi_t(i,j) = P(state t = i, state t+1 = j | data) via forward-backward — soft assignment tiap waktu ke tiap state. M-step: update parameter sebagai rata-rata tertimbang — misalnya a_ij baru = (jumlah ekspektasi transisi i→j) / (jumlah ekspektasi kunjungan ke i). Ulangi sampai likelihood konvergen. Tiga peringatan praktisi: (1) EM hanya menjamin OPTIMUM LOKAL — inisialisasi A yang berbeda bisa memberi rezim yang berbeda; jalankan 10+ restart dan pilih likelihood tertinggi. (2) Label switching: state 1 dan 2 tidak punya nama bawaan — satu run bisa melabeli krisis sebagai state 1, run lain sebagai state 2; NAMAI state setelah fitting berdasarkan maknanya (state dengan sigma emisi terbesar = krisis), jangan berdasarkan nomornya. (3) Kompleksitas O(T·K²) per iterasi — untuk T = 10.000 dan K = 5 masih murah; untuk K = 50, pikirkan ulang arsitekturnya.",
        "Contoh decoding rezim pasar yang konkret. Data: 250 return harian (sintetis). HMM 2 state, emisi Gaussian: tenang (mu = 0,0005, sigma = 0,008), krisis (mu = −0,002, sigma = 0,025), matriks transisi A = [[0,98, 0,02],[0,10, 0,90]] — krisis rata-rata bertahan 1/(1−0,90) = 10 hari. Setelah Baum-Welch + Viterbi, jalur decoded menunjukkan 3 episode krisis: hari 41–52, 118–129, dan 203–224. Validasi silang dengan realita: episode 203–224 bertepatan dengan lonjakan VIX — HMM menemukannya TANPA diberi tahu apa itu VIX. Tetapi perhatikan: gamma pada hari-hari perbatasan (misalnya hari 40 dan 53) hanya 55–60% — model sendiri tidak yakin di mana tepatnya krisis mulai. Praktisi yang jujur melaporkan ketidakpastian perbatasan ini, bukan garis tegas yang menipu.",
        "Kapan HMM gagal — dan apa penggantinya. Kegagalan 1: DURASI state. HMM mengasumsikan durasi state geometris (peluang bertahan tiap langkah = A_ii, memoryless): durasi paling mungkin selalu 1 langkah dengan ekor menurun eksponensial. Bila rezim nyatamu punya durasi khas (siklus bisnis 18 bulan, bukan 1 hari), HMM akan memotong-motongnya menjadi fragmen pendek — solusinya hidden semi-Markov model (HSMM) dengan distribusi durasi eksplisit. Kegagalan 2: OBSERVASI BERISIK. Bila emisi dua state tumpang tindih berat (sigma tenang 2% vs krisis 2,5%), gamma_t ≈ 50/50 di mana-mana — decoding tidak informatif; perbaiki fitur observasi dulu (tambah volume, VIX, credit spread sebagai observasi multivariat). Kegagalan 3: K TERLALU BESAR. Likelihood training selalu naik dengan K — pilih K dengan BIC atau validasi silang, bukan dengan likelihood. Aturan senior: HMM adalah mikroskop yang hebat untuk rezim yang MEMANG ada; ia tidak bisa menciptakan rezim dari noise — bila BIC memilih K = 1, percayalah: datamu satu rezim.",
      ],
      formula: String.raw`\gamma_t(i) = \frac{\alpha_t(i)\,\beta_t(i)}{\sum_{j=1}^{K} \alpha_t(j)\,\beta_t(j)}`,
      formulaNote: "gamma_t(i) = peluang state pada waktu t adalah i DENGAN SYARAT seluruh observasi O_1..O_T (smoothing); alpha = forward, beta = backward; penyebut = P(seluruh data), konstanta normalisasi. Contoh: alpha_50 = [0,6, 0,4], beta_50 = [0,5, 1,5] → pembilang [0,30, 0,60], penyebut 0,90 → gamma_50 = [0,33, 0,67]: peluang 67% bahwa hari ke-50 adalah krisis. Beda dengan filtering (alpha saja) yang hanya memakai data sampai t.",
      tasks: [],
      note: {
        title: "Intuisi: lima kebiasaan decoder rezim yang berpengalaman",
        body: "Pertama, selalu tanyakan dulu: Viterbi atau gamma? — kebutuhanmu (narasi koheren versus ketidakpastian per titik) menentukan jawabannya, dan keduanya sah untuk keperluan berbeda. Kedua, namai state dari emisinya, bukan nomornya: setelah fitting, urutkan state menurut sigma atau mu lalu beri label bermakna (tenang/krisis); label switching membuat nomor state tidak stabil antar run. Ketiga, cek durasi implisit: hitung 1/(1−A_ii) untuk tiap state dan tanyakan apakah masuk akal secara domain — bila krisis yang di-decode rata-rata 1,2 hari padahal krisis nyata berminggu-minggu, modelmu memfragmentasi. Keempat, Baum-Welch tanpa restart ganda adalah undian: 10 restart dengan inisialisasi acak, ambil likelihood tertinggi — EM itu rakus akan optimum lokal. Kelima, waspadai gamma yang malu-malu: bila peluang state tidak pernah jauh dari 50/50, HMM-mu tidak menemukan rezim — ia hanya memoles noise; jangan paksakan narasi krisis dari sana. Keenam, dokumentasikan inisialisasi Baum-Welch yang menang (seed + A awal) — fitting HMM yang tidak reproducible adalah temuan yang tidak bisa diaudit; di konteks risiko, itu tidak bisa dipakai untuk keputusan.",
      },
      quiz: [
        {
          q: "Diketahui alpha_50 = [0,6, 0,4] dan beta_50 = [0,5, 1,5] untuk HMM 2 state (state 2 = krisis). Berapa gamma_50(krisis)?",
          options: [
            { text: "0,67 — (0,4×1,5)/(0,6×0,5 + 0,4×1,5) = 0,60/0,90", why: "Benar: gamma = alpha·beta ternormalisasi; peluang hari ke-50 adalah krisis = 67%.", correct: true },
            { text: "0,40 — sama dengan alpha_50(krisis)", why: "Salah: alpha saja = filtering (hanya data sampai t); gamma memakai seluruh data via beta." },
            { text: "0,60 — pembilang tanpa normalisasi", why: "Salah: 0,60 adalah pembilang; peluang harus dinormalisasi dengan penyebut 0,90." },
            { text: "1,50 — nilai beta_50(krisis)", why: "Salah: beta adalah likelihood data masa depan, bukan peluang — ia bisa melebihi 1 dan harus dikombinasikan dengan alpha." },
          ],
        },
        {
          q: "Dua run Baum-Welch memberi hasil identik kecuali nomor state krisis tertukar (run 1: state 1, run 2: state 2). Penanganan yang benar?",
          options: [
            { text: "Normal — label switching; namai ulang state berdasarkan emisinya (sigma terbesar = krisis)", why: "Benar: nomor state tidak punya makna bawaan; yang stabil adalah parameter emisinya.", correct: true },
            { text: "Ada bug — ulangi sampai nomornya sama", why: "Salah: label switching adalah sifat matematis EM, bukan bug; memaksakan nomor sama justru menyembunyikannya." },
            { text: "Rata-ratakan matriks A kedua run", why: "Salah: merata-ratakan parameter dari pelabelan berbeda menghasilkan model Frankenstein yang tidak bermakna." },
            { text: "Pilih run dengan nomor krisis = 2", why: "Salah: nomor tidak membawa informasi; pilih berdasarkan likelihood tertinggi, lalu namai ulang." },
          ],
        },
        {
          q: "HMM 2 state dipakai untuk rezim ekonomi yang durasi khasnya ~6 bulan, tetapi state yang di-decode rata-rata bertahan 2 hari. Diagnosis?",
          options: [
            { text: "Durasi geometris HMM tidak cocok — pertimbangkan HSMM dengan distribusi durasi eksplisit", why: "Benar: HMM memoryless soal durasi (paling mungkin 1 langkah); rezim berdurasi khas butuh model durasi eksplisit.", correct: true },
            { text: "Tambah state sampai durasi rata-rata 6 bulan", why: "Salah: menambah K tidak mengubah sifat geometris durasi tiap state — hanya menambah fragmen." },
            { text: "Kurangi data training", why: "Salah: masalahnya asumsi model, bukan jumlah data; data lebih sedikit justru memperburuk estimasi." },
            { text: "Ganti emisi Gaussian dengan Poisson", why: "Salah: jenis emisi tidak ada hubungannya dengan distribusi durasi state." },
          ],
        },
      ],
      reference: "Gamma = smoothing (ketidakpastian per waktu); Viterbi = jalur koheren; Baum-Welch = EM + restart; waspadai durasi geometris.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "HMM = state tersembunyi (Markov) + observasi (emisi per state); joint = pi × transisi × emisi.",
        "Forward (Σ) = evaluasi kecocokan model; Viterbi (max) = dekode jalur state terbaik; Baum-Welch (EM) = belajar parameter tanpa label.",
        "Satu observasi tidak menentukan rezim — kekuatan HMM ada pada konteks temporal (episode).",
        "Kerjakan dalam log-space (log-sum-exp); Viterbi memberi jalur, bukan peluang — untuk peluang pakai forward-backward.",
        "Pilih K dengan BIC + keterinterpretasian; waspadai label-switching dan fase baru yang belum dilatih.",
      ],
      next: { label: "B21 — A/B Testing Terapan", href: "/learn/b21-ab-testing-terapan" },
      quiz: [
        {
          q: "Apa beda fundamental rantai Markov biasa dengan Hidden Markov Model?",
          options: [
            { text: "Rantai Markov: state terlihat langsung. HMM: state tersembunyi, yang terlihat hanya observasi (emisi) tiap state", why: "Benar: inilah kata hidden — state-nya tidak diobservasi. Seluruh mesin inferensi HMM (forward/Viterbi/Baum-Welch) ada untuk menjembatani observasi ke state.", correct: true },
            { text: "HMM tidak memakai sifat Markov", why: "Salah: HMM TETAP memakai sifat Markov — pada state tersembunyinya. Yang hidden adalah state-nya, bukan sifat Markovnya." },
            { text: "Rantai Markov untuk data kontinu, HMM untuk diskret", why: "Salah: keduanya bisa menangani observasi kontinu (emisi Gaussian) maupun diskret — pembedanya keterlihatan state." },
            { text: "Tidak ada beda — HMM hanya nama lain", why: "Salah: perbedaannya justru yang membuat tiga algoritma legendaris itu diperlukan." },
          ],
        },
        {
          q: "Kapan memakai Viterbi, kapan memakai forward-backward (smoothing)?",
          options: [
            { text: "Viterbi: butuh SATU jalur state terbaik (keputusan). Smoothing: butuh PELUANG tiap state per waktu (kehati-hatian)", why: "Benar: Viterbi = argmax (pemenang tunggal); gamma dari forward-backward = distribusi peluang. Blokir kartu butuh ambang peluang → smoothing; segmentasi historis → Viterbi.", correct: true },
            { text: "Keduanya sama — pilih yang lebih cepat", why: "Salah: outputnya beda jenis (jalur vs distribusi). Memilih berdasar kecepatan = memilih berdasar kriteria yang salah." },
            { text: "Viterbi untuk training, forward-backward untuk testing", why: "Salah: keduanya untuk inferensi; training (Baum-Welch) justru MEMAKAI keduanya di E-step." },
            { text: "Smoothing selalu lebih baik dari Viterbi", why: "Salah: bila yang dibutuhkan adalah satu segmentasi tegas untuk pelaporan, jalur Viterbi lebih tepat guna." },
          ],
        },
        {
          q: "Emisi bull ~ Normal(0,8; 1) dan bear ~ Normal(−0,8; 1). Return hari ini +0,1%. Apa kesimpulan rezimnya?",
          options: [
            { text: "Tidak bisa disimpulkan dari satu observasi — kedua state bisa memancarkannya; butuh rangkaian", why: "Benar: densitas keduanya di 0,1 hampir sama (tumpang tindih besar). Inilah alasan HMM bekerja pada episode, bukan titik.", correct: true },
            { text: "Bull — karena positif", why: "Salah: tanda positif tidak menentukan; bear pun sering memancarkan return positif kecil (sd=1 jauh lebih besar dari beda mean 1,6)." },
            { text: "Bear — karena dekat nol", why: "Salah: logika yang sama kelirunya dengan opsi bull — satu titik tidak cukup." },
            { text: "Hitung likelihood ratio-nya pasti bisa", why: "Salah: likelihood ratio satu observasi ≈ 1 (ambigu) — menghitungnya justru MEMBUKTIKAN tidak bisa disimpulkan." },
          ],
        },
        {
          q: "Baum-Welch dijalankan 5 kali dari inisialisasi berbeda menghasilkan 5 model dengan likelihood mirip tetapi label state tertukar-tukar. Tindakan benar?",
          options: [
            { text: "Normal (label-switching + optimum lokal) — selaraskan label antar-run, pilih berdasar BIC + interpretasi, laporkan ketidakstabilannya", why: "Benar: ini sifat EM, bukan bug. Yang berbahaya adalah diam-diam memakai satu run tanpa sadar labelnya bisa tertukar dengan run kemarin.", correct: true },
            { text: "Ada bug — EM seharusnya deterministik", why: "Salah: EM deterministik DARI inisialisasi yang sama; inisialisasi berbeda → optimum lokal berbeda. Itu matematika, bukan bug." },
            { text: "Ambil run dengan likelihood tertinggi, abaikan sisanya", why: "Salah: likelihood tertinggi belum tentu model terbaik (bisa overfit / tidak interpretable); dan mengabaikan ketidakstabilan = menyembunyikan risiko." },
            { text: "Naikkan iterasi hingga semua run sama", why: "Salah: iterasi tidak menyatukan optimum lokal yang berbeda — masalahnya inisialisasi, bukan konvergensi." },
          ],
        },
        {
          q: "Setelah setahun, distribusi observasi makin tidak cocok dengan SEMUA state emisi model fraud. Artinya?",
          options: [
            { text: "Kemungkinan muncul fase fraud BARU yang belum dilatih — investigasi + retraining, jangan paksa klasifikasi", why: "Benar: HMM hanya tahu fase yang dilatih. Emisi yang makin mismatch = dunia berubah (adversarial!). Model fraud tanpa rencana kedaluwarsa menunggu dikalahkan.", correct: true },
            { text: "Model rusak — buang dan kembali ke rule-based", why: "Salah: mundur ke rule-based yang lebih kaku bukan solusi; yang dibutuhkan adalah siklus retraining." },
            { text: "Tambah state sampai cocok lagi", why: "Salah: menambah state tanpa data fase baru hanya menciptakan state mistis yang overfit pada noise." },
            { text: "Abaikan — fluktuasi biasa", why: "Salah: mismatch SISTEMATIS yang membesar bukan fluktuasi — itu sinyal drift yang harus ditindaklanjuti." },
          ],
        },
      ],
    },
  ],
};
