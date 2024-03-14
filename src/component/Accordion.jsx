'use client'

// ========== REACT DEPEDENCY ========== //
import { useState } from 'react'

// ========== STYLE DEPEDENCY ========== //
import styles from './style/accordion.module.css';

/*
============================== CODE START HERE ==============================
*/
export function Accordion({
    item = [
        { title: 'Title', description: 'Description', icon: '+' },
        { title: 'Title 2', description: 'Description 2', icon: '+' },
    ]
}) {
    const [accordion, setAccordion] = useState(Array(item.length).fill(false));
    const handleAccordionState = (index) => {
        const content = document.querySelectorAll(`.${styles.content}`);

        const currentContent = content[index];
        content.forEach(item => {
            item.setAttribute('style', 'height: 0px');
        });

        if (!accordion[index]) { currentContent.setAttribute('style', `height: ${currentContent.scrollHeight}px`); }
        else { currentContent.setAttribute('style', `height: 0px`); }

        setAccordion((prevState) => {
            const currentState = prevState[index];
            const newState = Array(prevState.length).fill(false);
            newState[index] = currentState ? false : true;
            return newState;
        })
    }

    return (
        <div className={`${styles.container}`}>
            {
                item.map((item, index) => (
                    <div className={`${styles.item}`} onClick={() => { handleAccordionState(index) }} key={index}>
                        <div className={`${styles.header}`}>
                            <i className={accordion[index] ? styles.active : ''}>{item.icon}</i>
                            <h3 className={accordion[index] ? styles.active : ''}>{item.title}</h3>
                        </div>
                        <div className={`${styles.content}`}>
                            <div className={`${styles.description}`}>
                                {item.description}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}