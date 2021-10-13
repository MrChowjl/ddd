import request from '@/utils/request';

let id = location.search.charAt(location.search.length - 1)

export async function mediaEdit(params: any) {
    params.append('acc_id', id)
    return request('/v1/ad_plan_update', {
        method: 'POST',
        data: params,
    });
}

export async function queryList(params: any) {
    return request('/v1/ad_plan_list', {
        method: 'GET',
        params: {
            acc_id: id,
            ...params
        },
    });
}

export async function getCurrent(id: any) {
    return request(`/v1/ad_plan_info/${id}`, {
        method: 'GET',
    });
}


export async function deleteCurrent(params: any) {
    return request('/v1/ad_plan_del', {
        method: 'POST',
        data: params,
    });
}

export async function switchAccount(params: any) {
    return request('/v1/ad_plan_open_close', {
        method: 'POST',
        data: params,
    });
}