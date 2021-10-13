import request from '@/utils/request';

let id = location.search.charAt(location.search.length - 1)

export async function mediaEdit(params: any) {
    params.append('ad_acc_id', id)
    return request('/v1/member/materials_edit', {
        method: 'POST',
        data: params,
    });
}

export async function queryList(params: any) {
    return request('/v1/member/materials_list', {
        method: 'GET',
        params: {
            acc_id: id,
            type: 1,
            ...params
        },
    });
}

export async function getCurrent(params: any) {
    // params.append('acc_id', 'id')
    return request(`/v1/member/materials_one`, {
        method: 'GET',
        params: {
            acc_id: id,
            ...params
        },
    });
}


export async function deleteCurrent(params: any) {
    return request('/v1/member/materials_del', {
        method: 'POST',
        data: {
            acc_id: Number(id),
            ...params
        },
    });
}

export async function switchAccount(params: any) {
    return request('/v1/member/ad_plan_open_close', {
        method: 'POST',
        data: params,
    });
}