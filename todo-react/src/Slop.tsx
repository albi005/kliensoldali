import {useState} from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


export function Slop() {
    const [slop, setSlop] = useState(0);
    
    return (<>
        <Stack>
            <Button variant="text">
                AAAAAAa
            </Button>
            <Button variant="outlined">
                BBBBBB
            </Button>
        </Stack>
        <abbr>
            {slop}
            SLOP
        </abbr>
        <Button variant="contained">Hello world</Button>
        <input type="range" min={0} max={100} value={slop} onChange={e => setSlop(Number(e.currentTarget.value))}/>
    </>);
}