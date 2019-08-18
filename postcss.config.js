module.exports = {
    plugins: [
        require('autoprefixer')({
            "overrideBrowserslist": [
                "last 1 version",
                "> 1%",
                "IE >= 6",
                "Firefox 23",
                "Chrome 32",
                "Baidu 7.12",
                "Edge 12",
                "Opera 30",
                "Safari 5",
                "Samsung 5"
            ]
        })
    ]
}