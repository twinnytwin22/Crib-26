import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

function SiteLogo() {
    const { scrollY } = useScroll()
    const scale = useTransform(scrollY, [0, 300], [1, 0.8])
    const opacity = useTransform(scrollY, [0, 200], [1, 0.9])

    return (
        <motion.div
            className="fixed top-4 left-4 z-50"
            style={{ scale, opacity }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Image
                src="/crib-26-red-logo.png"
                alt="Site Logo"
                width={120}
                height={40}
                priority
            />
        </motion.div>
    )
}

export default SiteLogo