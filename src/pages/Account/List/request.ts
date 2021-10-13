import request from '@/utils/request';

export async function getOptions() {
    return request('v1/ad_accounts_section', {
        method: 'GET'
    });
}

export async function queryList(params: any) {
    return request('v1/ad_account_list', {
        method: 'GET',
        params: params
    });
}

export async function getCurrent(ID: string) {
    return request(`v1/ad_account_info/${ID}`, {
        method: 'GET',
    });
}

export async function getRTA(ID: string) {
    return request(`v1/rta_section/${ID}`, {
        method: 'GET',
    });
}


export async function addAcount(params: any) {
    return request('v1/add_ad_account', {
        method: 'POST',
        data: params,
    });
}

export async function acountDelete(params: any) {
    return request('v1/ad_account_del', {
        method: 'POST',
        data: params,
    });
}

export async function switchAccount(params: any) {
    return request('v1/ad_account_open_close', {
        method: 'POST',
        data: params,
    });
}