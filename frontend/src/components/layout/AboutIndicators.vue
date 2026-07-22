<template>

<div class="card">

        <h3>Sobre os indicadores</h3>
        <ul>
          <li><strong>Bateria abaixo de 10%:</strong> Robôs com nível de bateria menor que 10%.</li>
          <li><strong>Robôs inativos:</strong> Sem tarefas realizadas nos últimos 4 dias.</li>
          <li><strong>Alta taxa de falha:</strong> Taxa de falha maior que 40% no dia anterior.</li>
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