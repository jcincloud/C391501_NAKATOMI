var commData;
(function (commData) {
    commData.genderData = [
        { label: '男', value: true },
        { label: '女', value: false }
    ];
    commData.LangData = [
        { val: 'zh-TW', label: '繁體中文(台灣)' },
        { val: 'en-US', label: 'English' },
        { val: 'ja-JP', label: '日本語(日本)' }
    ];
    commData.bannerCategory = [
        { val: 0, label: '照片' },
        { val: 1, label: '影片' }
    ];
})(commData || (commData = {}));
