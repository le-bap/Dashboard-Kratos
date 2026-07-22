// Serviço que solicita do backend as informações completas de todos os robôs e lojas,
// e organiza as informações para apresentação inicial da dashboard

const robotList = [
  {
    robotid: "C4:3C:B0:AA:F7:AA"
  },
  {
    robotid: "C4:3C:B0:AA:F7:AB"
  },
  {
    robotid: "C4:3C:B0:AA:F7:AC"
  },
  {
    robotid: "C4:3C:B0:AA:F7:AD"
  }
]

const storeList = [
  {
    storeName: "INSIGN"
  },
  {
    storeName: "KRATOS"
  },
  {
    storeName: "Padaria do Futuro"
  },
  {
    storeName: "Restaurante", 
  }
]

const tables = {
  battery: {
    title: "Robôs com bateria abaixo de 10%",
    columns: [
      { label: "Robô", key: "robot" },
      { label: "Loja", key: "store" },
      { label: "Bateria", key: "battery" },
      { label: "Carregando?", key: "is_charging" },
    ],
    rows: [
      {
        robot: "C4:3C:B0:AA:F7:AA",
        store: "KRATOS",
        battery: "8%",
        is_charging: "Sim",
      },
      {
        robot: "C4:3C:B0:AA:F7:AB",
        store: "KRATOS",
        battery: "8%",
        is_charging: "Não",
      },
      {
        robot: "C4:3C:B0:AA:F7:AB",
        store: "KRATOS",
        battery: "8%",
        is_charging: "Sim",
      },
      {
        robot: "C4:3C:B0:AA:F7:AC",
        store: "KRATOS",
        battery: "8%",
        is_charging: "Não",
      },
      {
        robot: "C4:3C:B0:AA:F7:AC",
        store: "KRATOS",
        battery: "8%",
        is_charging: "Sim",
      },
      {
        robot: "C4:3C:B0:AA:F7:AA",
        store: "KRATOS",
        battery: "8%",
        is_charging: "Não",
      }
    ]
  },

  inactive: {
    title: "Robôs que não realizam tarefas há mais de 3 dias",
    columns: [
      { label: "Robô", key: "robot" },
      { label: "Loja", key: "store" },
    ],
    rows: [
      {
        robot: "C4:3C:B0:AA:F7:AA",
        store: "KRATOS",
      },
      {
        robot: "C4:3C:B0:AA:F7:AD",
        store: "INSIGN",
      },
      {
        robot: "C4:3C:B0:AA:F7:AC",
        store: "KRATOS",
      }
    ]
  },

  failed: {
    title: "Robôs com alta taxa de falha",
    columns: [
      { label: "Robô", key: "robot" },
      { label: "Loja", key: "store" },
      { label: "Num. tasks Completadas", key: "num_tasks_success" },
      { label: "Num. tasks Falhadas", key: "num_tasks_failed" },
    ],
    rows: [
      {
        robot: "C4:3C:B0:AA:F7:AD",
        store: "Padaria do Futuro",
        num_tasks_success: 20,
        num_tasks_failed: 10
      },
      {
        robot: "C4:3C:B0:AA:F7:AC",
        store: "KRATOS",
        num_tasks_success: 50,
        num_tasks_failed: 25
      },
      {
        robot: "C4:3C:B0:AA:F7:AB",
        store: "INSIGN",
        num_tasks_success: 10,
        num_tasks_failed: 5
      }
    ]
  },

  offline: {
    title: "Robôs offline",
    columns: [
      { label: "Robô", key: "robot" },
      { label: "Loja", key: "store" },
    ],
    rows: [
      {
        robot: "C4:3C:B0:AA:F7:AB",
        store: "KRATOS",
      },
      {
        robot: "C4:3C:B0:AA:F7:AC",
        store: "Restaurante",
      },
      {
        robot: "C4:3C:B0:AA:F7:AD",
        store: "KRATOS",
      },
      {
        robot: "C4:3C:B0:AA:F7:AC",
        store: "INSIGN",
      },
      {
        robot: "C4:3C:B0:AA:F7:AC",
        store: "INSIGN",
      },
      {
        robot: "C4:3C:B0:AA:F7:AA",
        store: "KRATOS",
      },
      {
        robot: "C4:3C:B0:AA:F7:AB",
        store: "Padaria do Futuro",
      },
      {
        robot: "C4:3C:B0:AA:F7:AB",
        store: "Restaurante",
      },
      {
        robot: "C4:3C:B0:AA:F7:AD",
        store: "INSIGN",
      }
    ]
  }
}

export function getTable(type) {
  return tables[type]
}

export function getRobotList() {
  return robotList
}

export function getStoreList() {
  return storeList
}

export function getPreview(type, limit = 5) {
  const table = tables[type]

  return {
    ...table,
    rows: table.rows.slice(0, limit),
    totalRows: table.rows.length
  }
}

export function getDashboardData(filters = {}) {
    const batteryRows = filterRows(
    tables.battery.rows,
    filters
  )

  const inactiveRows = filterRows(
    tables.inactive.rows,
    filters
  )

  const failedRows = filterRows(
    tables.failed.rows,
    filters
  )

  const offlineRows = filterRows(
    tables.offline.rows,
    filters
  )
  return {
    summary: {
      totalRobots: 64,
      totalStores: 89,
      lowBattery: tables.battery.rows.length,
      inactive: tables.inactive.rows.length,
      failed: tables.failed.rows.length,
      offline: tables.offline.rows.length
    },

    

    tables: {
      battery: {
        ...getPreview("battery"),
        rows: batteryRows.slice(0, 5),
        totalRows: batteryRows.length
      },

      inactive: {
        ...getPreview("inactive"),
        rows: inactiveRows.slice(0, 5),
        totalRows: inactiveRows.length
      },

      failed: {
        ...getPreview("failed"),
        rows: failedRows.slice(0, 5),
        totalRows: failedRows.length
      },

      offline: {
        ...getPreview("offline"),
        rows: offlineRows.slice(0, 5),
        totalRows: offlineRows.length
      }
    },

    filterBar: {
      robotList: getRobotList(),
      storeList: getStoreList()
    }
  }
}

// como ainda não tem backend, filtramos os dados por:
function filterRows(rows, filters) {
  return rows.filter(row => {

    const storeOk =
      !filters.store ||
      row.store.includes(filters.store)

    const robotOk =
      !filters.robot ||
      row.robot === filters.robot

    return storeOk && robotOk
  })
}