import React from 'react'
import styles from './button.module.scss'

function PrimaryButton({ label, icon }) {
    return (
        <button className={styles.primary_button}>
            {(icon) && < span className={styles.btn_icon}>
                <img src={icon} alt="" />
            </span>}
            <span className={styles.btn_text}>
                {label}
            </span>
        </button >
    )
}

function SecondaryButton({ label, icon }) {
    return (
        <button className={styles.secondary_button}>
            {(icon) && < span className={styles.btn_icon}>
                <img src={icon} alt="" />
            </span>}
            <span className={styles.btn_text}>
                {label}
            </span>
        </button >
    )
}


export default function RenderButton({ type, label, icon }) {
    switch (type) {
        case 'primary': {
            return (<PrimaryButton label={label} icon={icon} />)
            break;
        }

        case 'secondary': {
            return (<SecondaryButton label={label} icon={icon} />)
            break;
        }

        default: {
            return (<PrimaryButton label={label} icon={icon} />)
            break;
        }
    }
}

RenderButton.defaultProps = {
    type: 'primary',
    icon: null,
    label: 'Button'
}
