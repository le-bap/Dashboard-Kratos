<template>

<div class="card">

        <h3>Sobre os indicadores</h3>
        <ul>
          <li><strong>Bateria abaixo ou igual a 10%:</strong> Robôs com nível de bateria menor ou igual a 10%.</li>
          <li><strong>Robôs inativos:</strong> Sem tarefas realizadas nas últimas 72 horas.</li>
          <li><strong>Alta taxa de falha:</strong> Taxa de falha maior que 40% nas tarefas realizadas nas últimas 24 horas.</li>
          <li><strong>robot_status:</strong> roda a cada 30 minutos → busca lojas, cenas, robôs e status 
      (bateria, online/offline). <br><strong>delivery_tasks:</strong> roda a cada 3 horas → busca por novas entregas, 
      além das que já foram registradas.</li>
        </ul>  

</div>

</template>

<style scoped>

.card{
    background:white;
    border-radius:12px;
    padding:10px;
    display:flex;
    align-items:center;
    gap:18px;
    margin-bottom: 30px;
}

.content h3{
    margin:0;
    color:#666;
}

</style>