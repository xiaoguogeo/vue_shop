const productPlugins = []
if (process.env.NODE_ENV === 'production') {
    productPlugins.push('transform-remove-console')
}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset',
    ],
    plugins: [
        ...productPlugins
    ]
}
