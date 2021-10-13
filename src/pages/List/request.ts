import request from '@/utils/request';
export async function getOptions() {
    return request('v1/ad_accounts_section', {
        method: 'GET'
    });
}

export async function queryList(params: any) {
    return request('v1/ad_statistics_list', {
        method: 'GET',
        params: params
    });
}

export async function getCount() {
    return request('v1/index_count', {
        method: 'GET'
    });
}

export async function getAccount() {
    return request('v1/ad_account_list', {
        method: 'GET',
        params: { status: 3 }
    });
}

export async function getPlan(params: any) {
    return request('/v1/ad_plan_list', {
        method: 'GET',
        params: {
            ...params
        },
    });
}

export async function getUnit(params: any) {
    return request('/v1/ad_unit_list', {
        method: 'GET',
        params: {
            ...params
        },
    });
}

export async function getCreate(params: any) {
    return request('/v1/ad_designs_list', {
        method: 'GET',
        params: {
            ...params
        },
    });
}