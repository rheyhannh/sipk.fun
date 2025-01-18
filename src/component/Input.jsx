// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region ICON DEPEDENCY
import {
    FaEnvelope,
    FaCheckCircle,
    FaExclamationCircle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { FaCircleInfo, FaGear } from "react-icons/fa6";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/style/input.module.css';
// #endregion

const DEFAULT_FANCYINPUT_ICON = {
    empty: <FaCircleInfo />,
    validating: <FaGear />,
    error: <FaExclamationCircle />,
    success: <FaCheckCircle />,
    warning: <FaCheckCircle />,
    danger: <FaCheckCircle />,
}

const DEFAULT_FANCYINPUT_ICONCOLOR = {
    empty: 'var(--primary-color)',
    validating: 'var(--logo-second-color)',
    error: 'crimson',
    success: 'var(--success-color)',
    warning: 'var(--warning-color)',
    danger: 'var(--danger-color)',
}

/**
 * Props yang digunakan component `FancyInput`
 * @typedef {Object} FancyInputProps
 * @property {any} initialValue
 * Initial input value
 * 
 * - Default : `''`
 * @property {string} initialMessage
 * Initial message
 * 
 * - Default : `''`
 * @property {Object} fieldOptions
 * Opsi yang dapat diatur untuk parent element dari element `input`
 * @property {string | number} [fieldOptions.maxWidth]
 * Field maximum width
 * 
 * - Default : `400px`
 * @property {string | number} [fieldOptions.height]
 * Field height
 * 
 * - Default : `55px`
 * @property {string} [fieldOptions.backgroundColor]
 * Field background color
 * 
 * - Default : `var(--light-color)`
 * @property {string} [fieldOptions.margin]
 * Field margin
 * 
 * - Default : `0.5rem 0`
 * @property {string | number} [fieldOptions.borderRadius]
 * Field border radius
 * 
 * - Default : `50px`
 * @property {string} [fieldOptions.gridTemplateColumns]
 * Field layout
 * 
 * - Default : `1fr 70% 1fr`
 * - Default (useEye) : `1fr calc(70% - 25px) 25px 1fr`
 * @property {Object} inputOptions
 * Opsi yang dapat diatur untuk element `input`
 * @property {string | number} [inputOptions.padding]
 * Input padding
 * 
 * - Default : `0 0.25rem`
 * @property {string} [inputOptions.color]
 * Input color
 * 
 * - Default : `var(--dark-color)`
 * @property {string | number} [inputOptions.fontWeight]
 * Input font weight
 * 
 * - Default : `var(--font-semi-bold)`
 * @property {Object} placeholderOptions
 * Opsi yang dapat diatur untuk element `placeholder` pada `input`
 * @property {string} [placeholderOptions.color]
 * Placeholder color
 * 
 * - Default : `var(--infoDark-color)`
 * @property {string | number} [placeholderOptions.fontWeight]
 * Placeholder fontweight
 * 
 * - Default : `var(--font-medium)`
 * @property {React.ReactNode} [icon]
 * Input icon
 * 
 * - Default : `<FaEnvelope/>`
 * @property {string} iconColor
 * Input icon color
 * 
 * - Default : `var(--infoDark-color)`
 * @property {'empty' | 'validating' | 'error' | 'success' | 'warning' | 'danger'} _state
 * Input validator state dengan penjelasan berikut,
 * - `empty` : Input value masih kosong. State ini dapat diset melalui {@link FancyInputProps.validator validator} atau otomatis dengan {@link FancyInputProps.validateFalsyValue validateFalsyValue}
 * - `validating` : Input value sedang divalidasi. State ini otomatis diset saat input element `blur`.
 * - `error` : Input value tidak valid. State ini diset melalui {@link FancyInputProps.validator validator}.
 * - `success` : Input value valid dengan menggunakan success color. State ini diset melalui {@link FancyInputProps.validator validator}
 * - `warning` : Input value valid dengan menggunakan warning color. State ini diset melalui {@link FancyInputProps.validator validator}
 * - `danger` : Input value valid dengan menggunakan danger color. State ini diset melalui {@link FancyInputProps.validator validator}
 * @property {(val:any) => FancyInputValidatorReturnType} validator
 * Callback yang digunakan untuk memvalidasi input dengan parameter input value
 * dimana mereturn object berisi key `state` dan optional key `message`
 * 
 * ```jsx
 * const validateInput = (val) => {
 *      if (val.length < 5) {
 *          return { state: 'error', message: 'Password harus lebih dari 5 karakter' }
 *      } else if (val.length > 7) {
 *          return { state: 'danger', message: 'Password lemah' }
 *      } else if (val.length > 9) {
 *          return { state: 'warning', message: 'Password kurang kuat' }
 *      } else {
 *          return { state: 'success', message: 'Password kuat' }
 *      }
 * }
 * 
 * <FancyInput validator={validateInput} />
 * ```
 * 
 * Selain contoh state diatas, state `empty` juga dapat digunakan walaupun ini dihandle otomatis saat props {@link FancyInputProps.validateFalsyValue validateFalsyValue} truthy. 
 * Lihat penjelasan state validator {@link FancyInputProps._state disini}.
 * @property {(state:FancyInputProps['_state'], message?:string) => void} validatorOnClick
 * Callback saat element validator diclick dengan parameter {@link FancyInputProps._state state} dan current message.
 * @property {boolean} [validateFalsyValue]
 * Boolean untuk otomatis set state `empty` saat input value falsy seperti empty string
 * 
 * - Default : `true`
 * @property {Object} validatorIcon
 * @property {React.ReactNode} validatorIcon.empty
 * Input validator icon saat state `empty`
 * 
 * - Default : `<FaCircleInfo />`
 * @property {React.ReactNode} validatorIcon.validating
 * Input validator icon saat state `validating`
 * 
 * - Default : `<FaGear />`
 * @property {React.ReactNode} validatorIcon.error
 * Input validator icon saat state `error`
 * 
 * - Default : `<FaExclamationCircle />`
 * @property {React.ReactNode} validatorIcon.success
 * Input validator icon saat state `success`
 * 
 * - Default : `<FaCheckCircle />`
 * @property {React.ReactNode} validatorIcon.warning
 * Input validator icon saat state `warning`
 * 
 * - Default : `<FaCheckCircle />`
 * @property {React.ReactNode} validatorIcon.danger
 * Input validator icon saat state `danger`
 * 
 * - Default : `<FaCheckCircle />`
 * @property {Object} validatorIconColor
 * @property {string} validatorIconColor.empty
 * Input validator icon color saat state `empty`
 * 
 * - Default : `var(--primary-color)`
 * @property {string} validatorIconColor.validating
 * Input validator icon color saat state `validating`
 * 
 * - Default : `var(--logo-second-color)`
 * @property {string} validatorIconColor.error
 * Input validator icon color saat state `error`
 * 
 * - Default : `crimson`
 * @property {string} validatorIconColor.success
 * Input validator icon color saat state `success`
 * 
 * - Default : `var(--success-color)`
 * @property {string} validatorIconColor.warning
 * Input validator icon color saat state `warning`
 * 
 * - Default : `var(--warning-color)`
 * @property {string} validatorIconColor.danger
 * Input validator icon color saat state `danger`
 * 
 * - Default : `var(--danger-color)`
 * @property {boolean} [useEye]
 * Boolean untuk render icon `eye` yang digunakan untuk toggle sensor password dan tidak. 
 * Ini akan mengubah attribute `type` menjadi teks, umum digunakan pada input password.
 * 
 * - Default : `false`
 * @property {boolean} [hide]
 * 
 * Boolean untuk hide element sepenuhnya dengan apply style berikut, 
 * 
 * ```js
 * const style = {
 *      display: 'none',
 *      opacity: 0,
 *      visibility: 'hidden',
 *      user-select: 'none'
 * }
 * ```
 * 
 * - Default : `false`
 * @property {(val:any) => void} [onChange]
 * Callback saat input value berubah dengan param nilai baru dari input
 * @property {() => void} [onFocus]
 * Callback saat element input focus
 * @property {() => void} [onBlur]
 * Callback saat element input blur
 * @property {() => void} [onEmptyState]
 * Callback saat state input `empty`
 * @property {() => void} [onValidatingState]
 * Callback saat state input `validating`
 * @property {() => void} [onErrorState]
 * Callback saat state input `error`
 * @property {() => void} [onSuccessState]
 * Callback saat state input `success`
 * @property {() => void} [onWarningState]
 * Callback saat state input `warning`
 * @property {() => void} [onDangerState]
 * Callback saat state input `danger`
 */

/**
 * @typedef {Object} FancyInputValidatorReturnType
 * @property {Exclude<FancyInputProps['_state'], 'empty' | 'validating'>} state
 * Lorem
 * @property {string} [message]
 * Lorem
 */

/**
 * Input field yang dapat dilengkapi dengan validator atau sebuah callback untuk memvalidasi value input.
 * Validator atau callback nantinya mereturn {@link FancyInputProps._state state} dimana terdapat beberapa state sebagai berikut,
 * 
 * - `empty` : Input value masih kosong. State ini dapat diset melalui {@link FancyInputProps.validator validator} atau otomatis dengan {@link FancyInputProps.validateFalsyValue validateFalsyValue}
 * - `validating` : Input value sedang divalidasi. State ini otomatis diset saat input element `blur`.
 * - `error` : Input value tidak valid. State ini diset melalui {@link FancyInputProps.validator validator}.
 * - `success` : Input value valid dengan menggunakan success color. State ini diset melalui {@link FancyInputProps.validator validator}
 * - `warning` : Input value valid dengan menggunakan warning color. State ini diset melalui {@link FancyInputProps.validator validator}
 * - `danger` : Input value valid dengan menggunakan danger color. State ini diset melalui {@link FancyInputProps.validator validator}
 * 
 * Untuk custom styling dapat disetel melalui {@link FancyInputProps.fieldOptions fieldOptions}, {@link FancyInputProps.inputOptions inputOptions} dan {@link FancyInputProps.placeholderOptions placeholderOptions}.
 * Setiap state validator dapat menggunakan custom {@link FancyInputProps.validatorIcon validatorIcon} dan {@link FancyInputProps.validatorIconColor validatorIconColor}.
 * @param {Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onFocus' | 'onBlur'> & Omit<FancyInputProps, '_state'>} props FancyInput props
 * @returns {React.ReactElement} Rendered component
 */
export function FancyInput({
    type,
    name,
    placeholder,
    autoComplete,
    initialValue = '',
    initialMessage = '',
    fieldOptions,
    inputOptions,
    placeholderOptions,
    icon = <FaEnvelope />,
    iconColor = 'var(--infoDark-color)',
    validator,
    validatorOnClick,
    validateFalsyValue = true,
    validatorIcon = DEFAULT_FANCYINPUT_ICON,
    validatorIconColor = DEFAULT_FANCYINPUT_ICONCOLOR,
    useEye = false,
    hide = false,
    onChange,
    onFocus,
    onBlur,
    onEmptyState,
    onValidatingState,
    onErrorState,
    onSuccessState,
    onWarningState,
    onDangerState
}) {
    const [state, setState] = React.useState(
        /** @type {FancyInputProps['_state']} */
        ('empty')
    )

    const [value, setValue] = React.useState(
        /** @type {string} */
        (initialValue)
    )

    const [msg, setMsg] = React.useState(
        /** @type {string} */
        (initialMessage)
    )

    const [vIcon, setVIcon] = React.useState(
        /** @type {React.ReactNode} */
        (validatorIcon?.empty ?? DEFAULT_FANCYINPUT_ICON['empty'])
    )

    const [isEyeSlashed, setIsEyeSlashed] = React.useState(
        /** @type {boolean} */
        (false)
    )

    const invokeCallback = (callback) => {
        if (callback && typeof callback === 'function') callback();
    }

    const handleStateChange = (newState, message = '') => {
        setState(newState);
        setMsg(message);

        const stateCallbacks = {
            empty: onEmptyState,
            validating: onValidatingState,
            error: onErrorState,
            success: onSuccessState,
            warning: onWarningState,
            danger: onDangerState,
        };

        invokeCallback(stateCallbacks[newState]);
    }

    const handleOnChange = /** @type {React.ChangeEventHandler<HTMLInputElement>} */ ((e) => {
        setValue(e.target.value);
        invokeCallback(() => onChange?.(e.target.value));
    })

    const handleOnFocus = /** @type {React.FocusEventHandler<HTMLInputElement>} */ ((e) => {
        handleStateChange('validating');
        invokeCallback(onFocus);
    })

    const handleOnBlur = /** @type {React.FocusEventHandler<HTMLInputElement>} */ ((e) => {
        if (validateFalsyValue && !value) {
            handleStateChange('empty');
            invokeCallback(onBlur);
            return;
        }
        if (validator && typeof validator === 'function') {
            const { state = 'success', message = '' } = validator(value) ?? {};
            handleStateChange(state, message);
        } else {
            handleStateChange('success');
        }
        invokeCallback(onBlur);
    })

    React.useEffect(() => {
        setVIcon(validatorIcon?.[state] ?? DEFAULT_FANCYINPUT_ICON[state]);
    }, [state]);

    return (
        <div
            className={`${styles.fancy_variant} ${useEye ? styles.use_eye : ''} ${hide ? styles.hide : ''}`}
            style={{
                '--field-maxWidth': fieldOptions?.maxWidth || '400px',
                '--field-height': fieldOptions?.height || '55px',
                '--field-backgroundColor': fieldOptions?.backgroundColor || 'var(--light-color)',
                '--field-margin': fieldOptions?.margin || '0.5rem 0',
                '--field-borderRadius': fieldOptions?.borderRadius || '50px',
                '--field-gridTemplateColumns': fieldOptions?.gridTemplateColumns || '1fr 70% 1fr',
                '--icon-color': iconColor || 'var(--infoDark-color)',
                '--validator-emptyColor': validatorIconColor?.empty || DEFAULT_FANCYINPUT_ICONCOLOR['empty'],
                '--validator-validatingColor': validatorIconColor?.validating || DEFAULT_FANCYINPUT_ICONCOLOR['validating'],
                '--validator-successColor': validatorIconColor?.success || DEFAULT_FANCYINPUT_ICONCOLOR['success'],
                '--validator-warningColor': validatorIconColor?.warning || DEFAULT_FANCYINPUT_ICONCOLOR['warning'],
                '--validator-dangerColor': validatorIconColor?.danger || DEFAULT_FANCYINPUT_ICONCOLOR['danger'],
                '--validator-errorColor': validatorIconColor?.error || DEFAULT_FANCYINPUT_ICONCOLOR['error'],
                '--input-padding': inputOptions?.padding || '0 0.25rem',
                '--input-color': inputOptions?.color || 'var(--dark-color)',
                '--input-fontWeight': inputOptions?.fontWeight || 'var(--font-semi-bold)',
                '--placeholder-color': placeholderOptions?.color || 'var(--infoDark-color)',
                '--placeholder-fontWeight': placeholderOptions?.fontWeight || 'var(--font-medium)'
            }}
        >
            <i>{icon}</i>

            <input
                type={!useEye ? type : isEyeSlashed ? 'text' : type}
                name={name}
                placeholder={placeholder}
                autoComplete={autoComplete}
                value={value}
                onChange={handleOnChange}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
            />

            {useEye && (
                <i className={styles.eye}>
                    <span onClick={() => setIsEyeSlashed(x => !x)}>
                        {!isEyeSlashed ? <FaEye /> : <FaEyeSlash />}
                    </span>
                </i>
            )}

            <i className={`${styles.validator} ${styles[state]}`}>
                <span
                    onClick={() => validatorOnClick?.(state, msg)}
                >
                    {vIcon}
                </span>
            </i>
        </div>
    )
}