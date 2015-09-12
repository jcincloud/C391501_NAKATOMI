module commData {
    export var genderData: labelValue<boolean>[] = [
        { label: '男', value: true },
        { label: '女', value: false }
    ];
    export var LangData = [
        { val: 'zh-TW', label: '繁體中文(台灣)' },
        { val: 'en-US', label: 'English' },
        { val: 'ja-JP', label: '日本語(日本)' }
    ]
    export var bannerCategory = [
        { val: 0, label: '照片' },
        { val: 1, label: '影片' }
    ]
}