import request from '@/utils/request';

export async function mediaEdit(params: any) {
    return request('/v1/member/subuser_edit', {
        method: 'POST',
        data: params,
    });
}


export async function queryList(params: any) {
    return request('/v1/member/subuser_list', {
        method: 'GET',
        params: params,
    });
}

export async function getCurrent(params: any) {
    return request('/v1/member/project_one', {
        method: 'GET',
        params: params,
    });
}


export async function deleteCurrent(params: any) {
    return request('/v1/member/delete/subuser', {
        method: 'POST',
        data: params,
    });
}

export async function getIndustry() {
    return request('/v1/member/industry_list', {
        method: 'GET'
    });
}