// Serviço que solicita do backend as informações completas de todos os robôs com alerta

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
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
        battery: "8%",
        is_charging: "Sim",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
        battery: "8%",
        is_charging: "Não",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
        battery: "8%",
        is_charging: "Sim",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
        battery: "8%",
        is_charging: "Não",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
        battery: "8%",
        is_charging: "Sim",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
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
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
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
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
        num_tasks_success: 20,
        num_tasks_failed: 10
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
        num_tasks_success: 50,
        num_tasks_failed: 25
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
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
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      },
      {
        robot: "C4:3C:B0:AA:F7:2D",
        store: "INSIGN - Kratos Robotics",
      }
    ]
  }
}

export function getTable(type) {
  return tables[type]
}

export function getPreview(type, limit = 5) {
  const table = tables[type]

  return {
    ...table,
    rows: table.rows.slice(0, limit),
    totalRows: table.rows.length
  }
}

export function getDashboardData() {
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
      battery: getPreview("battery"),
      inactive: getPreview("inactive"),
      failed: getPreview("failed"),
      offline: getPreview("offline")
    }
  }
}