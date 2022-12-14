import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material'
import React from 'react'
import openIcone from '../../assets/images/select-arrow-dark.png'

const PlanFilter = () => {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    return (
        <>
            {/* <div className='' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <a href=''>Filter by :</a>
                <div style={{ display: 'flex', gap: '19px', flexWrap: 'wrap' }}>

                </div>
                <div className='d-flex' style={{ margin: '16px', gap: '11px' }}>
                    <Button onClick={() => { }} className='apply-btn'>Apply</Button>
                    <Button className='back-to-plans-btn'>Clear</Button>
                </div>
            </div> */}

            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <AccordionSummary
                    // expandIcon={openIcone}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Filter by
                    </Typography>
                    {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                    <img src={openIcone} />
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <h1>Demo</h1>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default PlanFilter