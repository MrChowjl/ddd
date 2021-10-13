import request from '@/utils/request';
export async function getOptions() {
    return request('v1/ad_accounts_section', {
        method: 'GET'
    });
}

export async function queryList(params: any) {
    return request('v1/index_account_list', {
        method: 'GET',
        params: params
    });
}

export async function getCount() {
    return request('v1/index_count', {
        method: 'GET'
    });
}