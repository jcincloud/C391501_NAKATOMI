﻿;

angular.module('angularApp', ['commfun', 'ui.bootstrap', 'toaster', 'angularFileUpload']).filter('category', function () {
    return function (input, data) {
        var r = input;
        if (data) {
            for (var i in data) {
                if (input == data[i].equipment_category_id) {
                    r = data[i].category_name;
                    break;
                }
            }
        }
        return r;
    };
}).controller('ctrl', [
    '$scope', '$http', '$sce', '$upload',
    function ($scope, $http, $sce, $upload) {
        var queryMonthDataState = gb_approot + apiGetAction + '/GetCheckMonthAverage';
        var excelMonthDownloadPath = gb_approot + 'Sys_Active/ExcelHandle/aj_excelMonthDown?tid=';
        var excelMonthUploadPath = gb_approot + 'Sys_Active/ExcelHandle/aj_excelMonthUpload?tid=';
        var excelMonthDeletePath = gb_approot + 'Sys_Active/ExcelHandle/aj_excelMonthDelete?tid=';

        $scope.excelMonthDownLoad = function () {
            var setPath = excelMonthDownloadPath + uniqid();
            $scope.ifrmeSrcPath = $sce.getTrustedResourceUrl(setPath);
        };
        $scope.onExcelMonthFileSelect = function ($files) {
            console.log($files);
            if ($files.length == 0)
                return;

            var getName = $files[0].name;
            var getSize = $files[0].size;
            var getType = $files[0].type;
            var limitSize = 100 * 1024 * 1024;
            var limitType = ['application/vnd.ms-excel'];

            if (getSize > limitSize) {
                console.log(getSize, limitSize);

                alert('檔案超過大小，限制' + limitSize + 'MB以內。');
                return false;
            }

            if (limitType.indexOf(getType) < 0) {
                alert('檔案格式不符，請選取Excel檔(Office 2007以上格式版本 .xlsx)。');
                return false;
            }

            $scope.isSelect = true;

            $scope.getFileInfo = {
                fileName: getName,
                fileSize: getSize
            };
            $scope.selectMonthExcelFiles = $files;
        };
        $scope.excelMonthUpload = function () {
            if (!$scope.isSelect) {
                alert('尚未選擇檔案');
                return;
            }

            var getFiles = $scope.selectMonthExcelFiles;
            $scope.isUpload = true;
            for (var i = 0; i < getFiles.length; i++) {
                var file = getFiles[i];
                var headerKeyValue = {};
                $scope.fileUpload = $upload.upload({
                    url: excelMonthUploadPath + uniqid(),
                    method: 'POST',
                    data: headerKeyValue,
                    file: file
                }).progress(function (evt) {
                    $scope.uploadProgress = {
                        snedSize: evt.loaded,
                        snedPresent: 100.0 * evt.loaded / evt.total
                    };
                }).success(function (data, status, headers, config) {
                    if (data.result) {
                        $scope.inputMonthFileValue = [];
                        alert('作業完成!');
                    } else {
                        alert(data.message);
                    }
                    $scope.isSelect = false;
                    $scope.isUpload = false;
                });
            }
        };
        $scope.getMonthUploadData = function () {
            $http.get(queryMonthDataState, { params: {} }).success(function (data, status, headers, config) {
                if (data.hasData) {
                    var collectItem = [];

                    for (var i in data.data) {
                        var item = data.data[i];
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 1, temperature: item.temperature_01, oxygen_concentration: item.oxygen_concentration_01 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 2, temperature: item.temperature_02, oxygen_concentration: item.oxygen_concentration_02 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 3, temperature: item.temperature_03, oxygen_concentration: item.oxygen_concentration_03 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 4, temperature: item.temperature_04, oxygen_concentration: item.oxygen_concentration_04 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 5, temperature: item.temperature_05, oxygen_concentration: item.oxygen_concentration_05 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 6, temperature: item.temperature_06, oxygen_concentration: item.oxygen_concentration_06 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 7, temperature: item.temperature_07, oxygen_concentration: item.oxygen_concentration_07 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 8, temperature: item.temperature_08, oxygen_concentration: item.oxygen_concentration_08 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 9, temperature: item.temperature_09, oxygen_concentration: item.oxygen_concentration_09 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 10, temperature: item.temperature_10, oxygen_concentration: item.oxygen_concentration_10 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 11, temperature: item.temperature_11, oxygen_concentration: item.oxygen_concentration_11 });
                        collectItem.push({ equipment_sn: item.equipment_sn, month: 12, temperature: item.temperature_12, oxygen_concentration: item.oxygen_concentration_12 });
                    }
                    $scope.gridItems = collectItem;
                } else {
                    alert(data.message);
                }
            });
        };

        $http.post(aj_Init, {}).success(function (data, status, headers, config) {
            $scope.InitData = data;
        });
        $scope.getMonthUploadData();
        $scope.lastUploadTime = new Date();
        $scope.countUpload = 5;
    }]);
