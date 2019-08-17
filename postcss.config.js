module.exports = {
    plugins: [
        require('autoprefixer')({
            "overrideBrowserslist": [
                "last 1 version",
                "> 1%",
                "IE 8",
                "firefox 23",
                "chrome 32",
                "baidu 7.12",
                "edge 16",
                "opera 48",
                "safari 11",
                "samsung 5",
                "and_chr 61",
                "and_ff 56",
                "and_qq 1.2",
                "and_uc 11.4"
            ]
        })
    ]
}