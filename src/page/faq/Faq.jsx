'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, AnimatePresence } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@faq_page/faq.module.css';
import ThemeChanger from '@/component/_test/ThemeChanger';
// #endregion

// #region ICON DEPEDENCY
import { FaPlus } from 'react-icons/fa6';
// #endregion

const TABS = [
    {
        title: 'SIPK',
        contents: [
            {
                title: 'Apa itu SIPK?',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
            {
                title: 'Apa bedanya SIPK dengan portal akademik kampus?',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
            {
                title: 'Kenapa SIPK ada?',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
            {
                title: 'Apakah SIPK hanya untuk mahasiswa tingkat awal?',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
            {
                title: 'Apakah ada batasan jurusan atau jenjang pendidikan untuk menggunakan SIPK?',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
            {
                title: 'Kenapa universitas aku engga ada di SIPK?',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
            {
                title: 'Apakah SIPK cuma bisa diakses lewat Laptop? ',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
            {
                title: 'Apakah SIPK berbayar?',
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'
            },
        ]
    },
    {
        title: 'Pendaftaran',
        contents: [
            { title: 'What is web development2', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'How do i know if i need it2', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'What does it cost2', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'What abous SEO2', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' }
        ]
    },
    {
        title: 'Rating',
        contents: [
            { title: 'What is web development3', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'How do i know if i need it3', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'What does it cost3', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'What abous SEO3', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' }
        ]
    },
    {
        title: 'Dolor',
        contents: [
            { title: 'What is web development4', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'How do i know if i need it4', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'What does it cost4', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' },
            { title: 'What abous SEO4', description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!' }
        ]
    }
]

const Accordion = ({ contents = [{ title: 'xyz', description: 'Lorem ipsum dolor sit amet.' }] }) => {
    const [activeIndex, setActiveIndex] = React.useState(/** @type {Array<number>} */([]));

    return (
        <motion.div
            className={styles.accordion}
            transition={{ duration: 0.75, type: 'spring', ease: 'backIn' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
        >
            {contents.map((item, index) => (
                <div key={index} className={`${styles.item} ${activeIndex.includes(index) ? styles.active : ''}`}>
                    <h2
                        className={styles.title}
                        onClick={() => {
                            const isActive = activeIndex.includes(index);
                            const clone = [...activeIndex];
                            if (isActive) {
                                setActiveIndex(clone.filter(val => val !== index));
                            } else {
                                clone.push(index);
                                setActiveIndex(clone);
                            }
                        }}
                    >
                        <span>{item.title}</span>
                        <FaPlus className={styles.icon} />
                    </h2>

                    <motion.div
                        className={styles.description}
                        transition={{ duration: 0.3, ease: 'easeInOut', bounce: 0 }}
                        initial={{ height: 0, marginBottom: 0 }}
                        animate={{
                            height: activeIndex.includes(index) ? 'max-content' : 0,
                            marginBottom: activeIndex.includes(index) ? '1.5rem' : 0,
                        }}
                    >
                        <p>
                            {item.description}
                        </p>
                    </motion.div>
                </div>
            ))}
        </motion.div>
    )
}

/**
 * Render faq page `'/faq'`
 * @param {{fakta:Array<import('@/types/supabase').FaktaData>}} props Faq props
 * @returns {React.ReactElement} Rendered faq page
 */
export default function Faq({ fakta }) {
    const containerRef = React.useRef(/** @type {HTMLDivElement} */(null));

    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className={`${styles.base} ${styles.colors}`}>
            <div ref={containerRef} className={styles.container}>
                <ThemeChanger />

                <div className={styles.heading}>
                    <h1 className={styles.title}>FAQs</h1>
                </div>

                <div className={styles.tabs}>
                    {TABS.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
                            onClick={() => {
                                setActiveTab(index);
                            }}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode={'wait'}>
                    {TABS.map((item, index) => activeTab === index && (
                        <Accordion key={index} contents={item.contents} />
                    ))}

                </AnimatePresence>
            </div>
        </div>
    )
}