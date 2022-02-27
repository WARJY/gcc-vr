export const STATIC = {
    FREQUENCY: 500,  // 生成时间间隔(ms)
    DURATION: 2000,  // 目标存在时间(ms)
    LIMIT: 60 * 1000,  // 目标存在时间(ms)
}

export const data = {
    time: 0,
    started: false,
    startTime: 0,
    duration: 0,
    score: 0,
    historyScore: [],
    maxScore: 0,
    load: {
        auditions: false,
        fonts: false
    },
}

export const source = {
    auditions: {
        tip: "",
        shoot: ""
    },
    fonts: {
        helvetiker_regular: ""
    }
} 