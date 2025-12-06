import {useState} from "react";

export function Slop() {
    const [slop, setSlop] = useState(0);
    
    return (<>
        <abbr>
            {slop}
            SLOP
        </abbr>
        <input type="range" min={0} max={100} value={slop} onChange={e => setSlop(Number(e.currentTarget.value))}/>
    </>);
}