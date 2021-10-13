import request from '@/utils/request';

let id = location.search.charAt(location.search.length - 1)

export async function mediaEdit(params: any) {
    params.append('acc_id', id)
    return request('/v1/ad_designs_update', {
        method: 'POST',
        data: params,
    });
}

export async function queryList(params: any) {
    return request('/v1/ad_designs_list', {
        method: 'GET',
        params: {
            acc_id: id,
            ...params
        },
    });
}

export async function getApp() {
    return request('/v1/app_section', {
        method: 'GET',
        params: {
            acc_id: id
        },
    });
}

export async function getPeople() {
    return request('/v1/member/crowds_list', {
        method: 'GET',
        params: {
            acc_id: id
        },
    });
}

export async function getLogo(params: any) {
    return request('/v1/member/materials_list', {
        method: 'GET',
        params: {
            acc_id: id,
            ...params
        },
    });
}

export async function getStyle() {
    return request(`/v1/ad_style_type/${id}`, {
        method: 'GET'
    });
}

export async function queryOption() {
    return request(`/v1/add_units_section/${id}`, {
        method: 'GET',
    });
}

export async function getCurrent(id: any) {
    return request(`/v1/ad_designs_info/${id}`, {
        method: 'GET',
    });
}


export async function deleteCurrent(params: any) {
    return request('/v1/ad_designs_del', {
        method: 'POST',
        data: params,
    });
}

export async function switchAccount(params: any) {
    return request('/v1/ad_designs_open_close', {
        method: 'POST',
        data: params,
    });
}

export async function getPlan() {
    return request('/v1/ad_plan_list', {
        method: 'GET',
        params: {
            acc_id: id
        },
    });
}

export async function getUnit() {
    return request('/v1/ad_unit_list', {
        method: 'GET',
        params: {
            acc_id: id
        },
    });
}