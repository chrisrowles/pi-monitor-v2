<template>
  <div>
    <PageTitle title="Services"></PageTitle>
    <Loading :show="!loaded" :status="status" :message="message"></Loading>
    <transition name="fade">
      <div class="pb-2" v-if="loaded">
        <MainHeader title="System Services" class="mt-5 mt-md-4"></MainHeader>
        <section id="overview" class="my-4">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="platform-header h-100">
                <StatCard title="Running Services" color="success" icon="cogs">
                  <template v-slot:content>
                    <h1>2</h1>
                  </template>
                </StatCard>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="cpu-header h-100">
                <StatCard  title="Stopped Services" color="secondary" icon="server">
                  <template v-slot:content>
                    <h1>2</h1>
                  </template>
                </StatCard>
              </div>
            </div>
          </div>
        </section>

        <section id="metrics" class="bg-white p-4 my-4 shadow border-radius-5">
          <div class="row">
            <div class="col-12">
              <div class="card border-0">
                <div class="card-header bg-white text-muted">
                  <fa-icon :icon="['fas', 'cogs']" class="mr-3"></fa-icon>Services
                </div>
                <div class="card-body">
                  <table class="table table-striped table-sm">
                    <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Version</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Apache</td>
                      <td>2.4.41</td>
                      <td class="running">Running</td>
                      <td>
                        <div class="d-flex flex-row justify-content-start">
                          <button class="btn btn-outline-secondary btn-sm"><fa-icon :icon="['fas', 'cogs']"></fa-icon></button>
                          <button class="btn btn-outline-warning btn-sm ml-3"><fa-icon :icon="['fas', 'redo']"></fa-icon></button>
                          <button class="btn btn-outline-danger btn-sm ml-3"><fa-icon :icon="['fas', 'stop']"></fa-icon></button>
                          <button class="btn btn-outline-info btn-sm ml-3"><fa-icon :icon="['fas', 'list']"></fa-icon></button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>MySQL</td>
                      <td>8.0.26</td>
                      <td class="running">Running</td>
                      <td>
                        <div class="d-flex flex-row justify-content-start">
                          <button class="btn btn-outline-secondary btn-sm"><fa-icon :icon="['fas', 'cogs']"></fa-icon></button>
                          <button class="btn btn-outline-warning btn-sm ml-3"><fa-icon :icon="['fas', 'redo']"></fa-icon></button>
                          <button class="btn btn-outline-danger btn-sm ml-3"><fa-icon :icon="['fas', 'stop']"></fa-icon></button>
                          <button class="btn btn-outline-info btn-sm ml-3"><fa-icon :icon="['fas', 'list']"></fa-icon></button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Postfix</td>
                      <td>11.15.0</td>
                      <td class="running">Running</td>
                      <td>
                        <div class="d-flex flex-row justify-content-start">
                          <button class="btn btn-outline-secondary btn-sm"><fa-icon :icon="['fas', 'cogs']"></fa-icon></button>
                          <button class="btn btn-outline-warning btn-sm ml-3"><fa-icon :icon="['fas', 'redo']"></fa-icon></button>
                          <button class="btn btn-outline-danger btn-sm ml-3"><fa-icon :icon="['fas', 'stop']"></fa-icon></button>
                          <button class="btn btn-outline-info btn-sm ml-3"><fa-icon :icon="['fas', 'list']"></fa-icon></button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Guacd</td>
                      <td>10.4.1</td>
                      <td class="stopped">Stopped</td>
                      <td>
                        <div class="d-flex flex-row justify-content-start">
                          <button class="btn btn-outline-secondary btn-sm"><fa-icon :icon="['fas', 'cogs']"></fa-icon></button>
                          <button class="btn btn-outline-warning btn-sm ml-3"><fa-icon :icon="['fas', 'redo']"></fa-icon></button>
                          <button class="btn btn-outline-danger btn-sm ml-3"><fa-icon :icon="['fas', 'stop']"></fa-icon></button>
                          <button class="btn btn-outline-info btn-sm ml-3"><fa-icon :icon="['fas', 'list']"></fa-icon></button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Supervisor</td>
                      <td>4.1.0</td>
                      <td class="stopped">Stopped</td>
                      <td>
                        <div class="d-flex flex-row justify-content-start">
                          <button class="btn btn-outline-secondary btn-sm"><fa-icon :icon="['fas', 'cogs']"></fa-icon></button>
                          <button class="btn btn-outline-warning btn-sm ml-3"><fa-icon :icon="['fas', 'redo']"></fa-icon></button>
                          <button class="btn btn-outline-danger btn-sm ml-3"><fa-icon :icon="['fas', 'stop']"></fa-icon></button>
                          <button class="btn btn-outline-info btn-sm ml-3"><fa-icon :icon="['fas', 'list']"></fa-icon></button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Tomcat</td>
                      <td>9.8.0</td>
                      <td class="stopped">Stopped</td>
                      <td>
                        <div class="d-flex flex-row justify-content-start">
                          <button class="btn btn-outline-secondary btn-sm"><fa-icon :icon="['fas', 'cogs']"></fa-icon></button>
                          <button class="btn btn-outline-warning btn-sm ml-3"><fa-icon :icon="['fas', 'redo']"></fa-icon></button>
                          <button class="btn btn-outline-danger btn-sm ml-3"><fa-icon :icon="['fas', 'stop']"></fa-icon></button>
                          <button class="btn btn-outline-info btn-sm ml-3"><fa-icon :icon="['fas', 'list']"></fa-icon></button>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<style>
.running {
  background: #beffe0;
}
.stopped {
  background: #fad0cd;
}
</style>

<script>
import PageTitle from '@/components/common/PageTitle';
import MainHeader from '@/components/common/MainHeader';
import StatCard from '@/components/common/StatCard';
import Loading from '@/components/common/Loading';

export default {
  data() {
    return {
      loaded: false,
      message: 'Loading system services...',
      status: false
    }
  },
  created() {
    setTimeout(() => {
      this.status = true
      this.loaded = true
    }, 2000)
  },
  methods: {

  },
  components: {
    StatCard,
    PageTitle,
    Loading,
    MainHeader
  }
}
</script>