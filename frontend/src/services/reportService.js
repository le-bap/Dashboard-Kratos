import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatCellValue } from "../utils/formatters"
import logo from "../assets/logo-kratos-white.png"


export function exportDashboardReport(dashboard, filters) {

    const doc = new jsPDF()

    // HEADER
    doc.setFillColor(255,255,255)

    doc.rect(
        0,
        0,
        210,
        40,
        "F"
    )

    // título central
    doc.setTextColor(33, 93, 209)
    doc.setFontSize(20)
    doc.text(
        "Painel de Controle da Kratos Robotics",
        105,
        20,
        {
            align:"center"
        }
    )


    // INFORMAÇÕES
    doc.setTextColor(0,0,0)
    doc.setFontSize(11)
    const now = new Date()
    doc.text(
        `Exportado em: ${now.toLocaleString("pt-BR")}`,
        15,
        35
    )
    doc.text(
        `Loja: ${filters.store ?? "Todas"}`,
        15,
        45
    )
    doc.text(
        `Robô: ${filters.robot ?? "Todos"}`,
        15,
        52
    )


    // TABELAS
    let y = 70
    y = createTable(
        doc,
        "Robôs com bateria abaixo de 10%",
        dashboard.tables.battery,
        y,
        "#FF0000"
    )
    y += 15
    y = createTable(
        doc,
        "Robôs que não realizam tarefas a mais de 72 horas",
        dashboard.tables.inactive,
        y,
        "#00A000"
    )
    y += 15
    y = createTable(
        doc,
        "Robôs com alta taxa de falha na entrega",
        dashboard.tables.failed,
        y,
        "#FFA500"
    )
    y += 15
    createTable(
        doc,
        "Robôs offline",
        dashboard.tables.offline,
        y,
        "#FF00FF"
    )

    doc.save("kratos-dashboard-report.pdf")

}




function createTable(
    doc,
    title,
    table,
    y,
    color
){

    /*
    Caso a tabela fique no fim da página
    cria uma nova
    */

    if(y > 250){

        doc.addPage()
        y = 20

    }


    /*
    Título da tabela
    */


    doc.setFontSize(13)

    doc.setTextColor(color)

    doc.text(
        title,
        15,
        y
    )


    /*
    tabela
    */


    autoTable(doc,{

        startY:y+5,


        head:[
            table.columns.map(
                col=>col.label
            )
        ],


        body:
            table.rows.map(row=>
                table.columns.map(
                    col=>formatCellValue(row, col)
                )
            ),


        theme:"grid",


        styles:{
            fontSize:9
        },


        headStyles:{
            fillColor:[33,93,209],
            textColor:255
        }

    })


    return doc.lastAutoTable.finalY

}