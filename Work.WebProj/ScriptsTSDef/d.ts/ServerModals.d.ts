declare module server {
    interface BaseEntityTable {
        edit_type: number;
        check_del: boolean;
        expland_sub: boolean;
    }
    interface i_Code {
        code: string;
        langCode: string;
        value: string;
    }
    interface CUYUnit {
        sign: string;
        code: string;
    }
    interface i_Lang extends BaseEntityTable {
        lang: string;
        area: string;
        memo: string;
        isuse: boolean;
        sort: any;
    }
    interface loginField {
        lang: string;
        account: string;
        password: string;
        img_vildate: string;
        rememberme: boolean;

    }
    interface Equipment extends BaseEntityTable {
        equipment_id: number;
        uSERID: string;
        equipment_sn: string;
        category: string;
        setup_amount: number;
        i_InsertDateTime: Date;
        i_UpdateDateTime: Date;
        is_new_equip: boolean;
        apply_Detail: any[];
        category_name: string;
    }
    interface Equipment_Category extends BaseEntityTable {
        equipment_category_id: number;
        category_name: string;
        sort: number;
        uSERID: string;
        equipment: server.Equipment[];
    }
    interface Apply extends BaseEntityTable {
        apply_id: number;
        Y: number;
        USERID: string;
        doc_date: Date;
        start_date: Date;
        end_date: Date;
        idno_category: number;
        doc_name: string;
        doc_rank: string;
        doc_tel: string;
        doc_gender: boolean;
        mng_name: string;
        mng_rank: string;
        mng_tel: string;
        mng_gender: boolean;
        memo: string;
        verify_state: number;
        verify_user_id: number;
        verify_date: Date;
        i_InsertDateTime: Date;
        i_UpdateDateTime: Date;
        apply_Detail: any[];
    }
    interface Apply_Detail extends BaseEntityTable {
        apply_detail_id: number;
        apply_id: number;
        Y: number;
        uSERID: string;
        equipment_id: number;
        equipment_sn: string;
        avg_Y_gas_temperature: number;
        avg_Y_oxygen_concentration: number;
        abnormal: string;
        verify_state: number;
        verify_user_id: number;
        verify_date: Date;
        memo: string;
        i_InsertDateTime: Date;
        i_UpdateDateTime: Date;
        apply: server.Apply;
        fule_Apply: any[];
        equipment: server.Equipment;
    }
    interface Fuel_Apply extends BaseEntityTable {
        fuel_apply_id: number;
        apply_detail_id: number;
        Y: number;
        USERID: string;
        fuel_category: string;
        fuel_name: string;
        low_hot_value: number;
        low_hot_unit: string;
        year_fuel_amount: number;
        year_fuel_unit: string;
        i_InsertDateTime: Date;
        i_UpdateDateTime: Date;
        apply_Detail: server.Apply_Detail;
    }
    interface Apply_User extends BaseEntityTable {
        apply_user_id: number;
        uSERID: string;
        uSERNAME: string;
        memo: string;
        sort: number;
        i_Hide: number;
        異動人員: number;
        異動日期: Date;
    }
    interface rpt_apply {
        equipment_category: string;
        equipment_sn: string;
        setup_amount: number;
        category: string;
        category_name: string;
        abnormal: string;
        low_hot_value: number;
        year_fuel_amount: number;
        avg_Y_gas_temperature: number;
        avg_Y_oxygen_concentration: number;
        low_hot_unit: string;
        year_fuel_unit: string;
    }
    interface FuelUnitDefine {
        code: string;
        value: string;
        unit_all_name: string;
        unit_short_name: string;
    }
    interface Apply_MonthAverage extends BaseEntityTable {
        apply_monthaverage_id: number;
        equipment_id: number;
        y: number;
        uSERID: string;
        temperature_01: number;
        oxygen_concentration_01: number;
        temperature_02: number;
        oxygen_concentration_02: number;
        temperature_03: number;
        oxygen_concentration_03: number;
        temperature_04: number;
        oxygen_concentration_04: number;
        temperature_05: number;
        oxygen_concentration_05: number;
        temperature_06: number;
        oxygen_concentration_06: number;
        temperature_07: number;
        oxygen_concentration_07: number;
        temperature_08: number;
        oxygen_concentration_08: number;
        temperature_09: number;
        oxygen_concentration_09: number;
        temperature_10: number;
        oxygen_concentration_10: number;
        temperature_11: number;
        oxygen_concentration_11: number;
        temperature_12: number;
        oxygen_concentration_12: number;
        i_InsertDateTime: Date;
        i_State: number;
        memo: string;
        equipment: {
            equipment_id: number;
            uSERID: string;
            equipment_sn: string;
            category: number;
            setup_amount: number;
            i_InsertDateTime: Date;
            i_UpdateDateTime: Date;
            is_new_equip: boolean;
            apply_Detail: any[];
            equipment_Category: {
                equipment_category_id: number;
                category_name: string;
                sort: number;
                uSERID: string;
                equipment: any[];
            };
            申報明細檔_每月監測平均值: server.Apply_MonthAverage[];
        };
    }
    interface m_Apply_MonthAverage extends Apply_MonthAverage {
        equipment_sn:string
    }
    interface Apply_MonthUnit {
        month: number;
        temperature: number;
        oxygen_concentration: number;
    }
    interface Apply_MonthExcelUnit extends Apply_MonthUnit {
        equipment_sn: string;
    }
    interface AspNetRoles extends BaseEntityTable {
        Id: string;
        name: string;
        aspNetUsers: any[];
    }
    interface AspNetUsers extends BaseEntityTable {
        Id: string;
        email: string;
        emailConfirmed: boolean;
        passwordHash: string;
        securityStamp: string;
        phoneNumber: string;
        phoneNumberConfirmed: boolean;
        twoFactorEnabled: boolean;
        lockoutEndDateUtc: Date;
        lockoutEnabled: boolean;
        accessFailedCount: number;
        userName: string;
        department_id: number;
        aspNetRoles: server.AspNetRoles[];
        role_array: any;
    }
} 