module.exports = function() {
	return {
		name: 'styles',
		path: 'admin',
		context: {
			type: 'admin',
			init: function init() {

				Vue.component('styles-editor', {
					props: ['enabled', "item"],
					template: `<div  class="partial-editor-component" v-show="!!item">
						<label class="important"><span v-html="item && item.label"></span></label>
						<hr>
						<codemirror mode="css" ref="htmlEditor" :enabled="enabled" v-model="htmlData"></codemirror>
						<button class="btn" @click="save" v-html="progress?'Guardando...':'Guardar'"></button>
					</div>`,
					data() {
						return {
							jsData: '',
							htmlData: '',
							progress: false
						}
					},
					watch: {
						item() {
							this.htmlData = this.item && this.item.htmlData
							this.$refs.htmlEditor.setValue(this.htmlData, -1);
						}
					},
					methods: {
						save() {
							this.progress = true;
							apiPost('/api/git/path', {
								files: [{
									contents: this.htmlData,
									path: this.item.htmlPath
								}],
								path: this.item.basePath
							}).then(r => {
								this.progress = false;
								if (!r.result) {
									new Noty({
										layout: 'bottomCenter',
										text: "Error",
										type: 'error',
										killer: true,
										delay: false
									}).show();
								} else {
									new Noty({
										timeout: 2500,
										layout: 'bottomCenter',
										text: "Los cambios se aplicaran la proxima vez que publique el sitio.",
										type: 'info',
										killer: true
									}).show();
								}
							});
						}
					}
				});

				window.vues=window.vues||[];
				window.vues['main']= new Vue({
					el: '.appScope',
					name: 'adminStyles',
					data() {
						return {
							selectedItem:null
						}
					},
					created() {
						apiGet('/api/styles').then(r => {
							this.selectedItem = r.result;
						});
					},
					mounted() {},
					methods: {
					}
				});



			}
		}
	}
}