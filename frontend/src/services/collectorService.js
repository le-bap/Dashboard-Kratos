// Serviço responsável pelas informações do Collector
// Futuramente será substituído por chamadas ao backend
const collectorData = {
    status: "Dados atualizado com sucesso",
    lastAttempt: "01/07/2026 10:00",
    lastUpdate: "01/07/2026 10:00",
    nextUpdate: "01/07/2026 11:00",
    isRunning: false
}

export function getCollectorStatus(){
    return {
        ...collectorData
    }
}

export function updateCollector(){
    const updatedCollector = {
        ...collectorData,
        lastAttempt:
            new Date().toLocaleString("pt-BR")

    }

    return updatedCollector
}