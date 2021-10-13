import request from '@/utils/request';

export async function mediaEdit(params: any) {
    return request('/v1/member/advs_edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        ContentType: 'multipart/form-data',
        data: params,
    });
}


export async function queryList(params: any) {
    return request('/v1/member/advs_list', {
        method: 'GET',
        params: params,
    });
}

export async function getCurrent(params: any) {
    return request('/v1/member/advs_one', {
        method: 'GET',
        params: params,
    });
}


export async function deleteCurrent(params: any) {
    return request('/v1/member/delete/adv', {
        method: 'POST',
        data: params,
    });
}

export async function getIndustry() {
    return request('/v1/member/industry_list', {
        method: 'GET'
    });
}

export async function qualiAdd(params: any) {
    return request('/v1/member/adv_qualification_add', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        ContentType: 'multipart/form-data',
        data: params,
    });
}

export async function deleteQuly(params: any) {
    return request('/v1/member/adv_qualification_del', {
        method: 'POST',
        data: params,
    });
}