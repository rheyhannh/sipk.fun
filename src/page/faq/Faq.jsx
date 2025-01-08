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

const LOREM_TITLE = 'Lorem ipsum dolor?';
const LOREM_DESCRIPTION = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint tempora quasi eligendi distinctio, mollitia porro repudiandae modi consectetur consequuntur perferendis!'

const TABS = [
    {
        title: 'sipk',
        type: 'uppercase',
        contents: [
            {
                title: 'Apa itu SIPK?',
                description: LOREM_DESCRIPTION
            },
            {
                title: 'Apa bedanya SIPK dengan portal akademik kampus?',
                description: LOREM_DESCRIPTION
            },
            {
                title: 'Kenapa SIPK ada?',
                description: LOREM_DESCRIPTION
            },
            {
                title: 'Apakah SIPK hanya untuk mahasiswa tingkat awal?',
                description: LOREM_DESCRIPTION
            },
            {
                title: 'Apakah ada batasan jurusan atau jenjang pendidikan untuk menggunakan SIPK?',
                description: LOREM_DESCRIPTION
            },
            {
                title: 'Kenapa universitas aku engga ada di SIPK?',
                description: LOREM_DESCRIPTION
            },
            {
                title: 'Apakah SIPK cuma bisa diakses lewat Laptop? ',
                description: LOREM_DESCRIPTION
            },
            {
                title: 'Apakah SIPK berbayar?',
                description: LOREM_DESCRIPTION
            },
        ]
    },
    {
        title: 'pendaftaran',
        type: 'capitalize',
        contents: [
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
        ]
    },
    {
        title: 'rating',
        type: 'capitalize',
        contents: [
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
        ]
    },
    {
        title: 'dolor',
        type: 'capitalize',
        contents: [
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
            {
                title: '',
                description: LOREM_DESCRIPTION
            },
        ]
    }
]

/**
 * Render faq page `'/faq'`
 * @param {{fakta:Array<import('@/types/supabase').FaktaData>}} props Faq props
 * @returns {React.ReactElement} Rendered faq page
 */
export default function Faq({ fakta }) {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <Base>
            <Container>
                <ThemeChanger />
                <Heading title={'FAQs'} />
                <Tabs>
                    {TABS.map((item, index) => (
                        <Tab
                            key={index}
                            title={transformTabTitle(item.title, item.type)}
                            isActive={activeTab === index}
                            tabIndex={index}
                            setActiveTab={setActiveTab}
                        />
                    ))}
                </Tabs>
                <AnimatePresence mode={'wait'}>
                    {TABS.map((item, index) => activeTab === index && (
                        <Accordion key={index} contents={item.contents} />
                    ))}
                </AnimatePresence>
            </Container>
        </Base>
    )
}

function Base({ children, ...props }) {
    return (
        <div className={`${styles.base} ${styles.colors}`} {...props}>
            {children}
        </div>
    )
}

function Container({ children, ...props }) {
    return (
        <div className={styles.container} {...props}>
            {children}
        </div>
    )
}

function Heading({ title, ...props }) {
    return (
        <div className={styles.heading} {...props}>
            <h1 className={styles.title}>
                {title}
            </h1>
        </div>
    )
}

function Tabs({ children, ...props }) {
    return (
        <div className={styles.tabs} {...props}>
            {children}
        </div>
    )
}

function Tab({ title, isActive, tabIndex, setActiveTab, ...props }) {
    return (
        <div
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => { setActiveTab(tabIndex) }}
            {...props}
        >
            {title}
        </div>
    )
}

function Accordion({ contents = [{ title: LOREM_TITLE, description: LOREM_DESCRIPTION }], ...props }) {
    const [activeIndex, setActiveIndex] = React.useState(/** @type {Array<number>} */([]));

    return (
        <motion.div
            className={styles.accordion}
            transition={{ duration: 0.75, type: 'spring', ease: 'backIn' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            {...props}
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
                        <span>
                            {item.title || LOREM_TITLE}
                        </span>
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
                            {item.description || LOREM_DESCRIPTION}
                        </p>
                    </motion.div>
                </div>
            ))}
        </motion.div>
    )
}

/**
 * Transform `text` yang diberikan menjadi format spesifik tertentu
 * dengan mereplace garis bawah `_` dan tanda kurang `-` menjadi spasi dan melakukan format dengan tipe transform yang digunakan.
 * 
 * Untuk tipe format dapat dilihat sebagai berikut,
 * - `normal` : Format teks menggunakan lowercase 
 * - `capitalize` : Format teks menggunakan Pascal Case
 * - `uppercase` : Format teks menggunakan uppercase
 * 
 * @param {string} text Input teks, default `lorem_ipsum`
 * @param {'normal' | 'capitalize' | 'uppercase'} type Tipe transform yang digunakan, default `normal`
 * @returns {string} Lorem
 * @example 
 * ```js
 * console.log(transformTabTitle('transform_me', 'capitalize')); // 'Transform Me'
 * console.log(transformTabTitle('transform_me', 'uppercase'));  // 'TRANSFORM ME'
 * console.log(transformTabTitle('transform-me', 'normal'));     // 'transform me'
 * console.log(transformTabTitle('transform-me', 'capitalize')); // 'Transform Me'
 * console.log(transformTabTitle('transformme', 'uppercase'));   // 'TRANSFORMME'
 * ```
 */
function transformTabTitle(text = 'lorem_ipsum', type = 'normal') {
    let words = text.replace(/[_-]/g, ' ').split(' ');

    if (type === 'capitalize') {
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
    if (type === 'uppercase') {
        return words.join(' ').toUpperCase();
    }

    return words.join(' ').toLowerCase();
}