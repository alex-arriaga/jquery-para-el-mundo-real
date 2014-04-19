/**
 * Creado por Alex Arriaga (@alex_arriaga_m) para la comunidad de desarrolladores.
 * Una demostración de inserción de datos hacia CakePHP usando un llamado Ajax y una forma de leer esos datos después
 * de ejecutar la operación de inserción.
 *
 * Repositorio: https://github.com/alex-arriaga/jquery-para-el-mundo-real
 * 18/Abril/2014
 * Monterrey, N.L, México
 * http://www.alex-arriaga.com
 */

(function ($){
	$(document).on('ready', function(){
		// 1. Obtener el formulario y crear dinámicamente el select de profesores
		$('#create-course-container').load('form.html', function(){
			$.ajax({
				url: '/universidad-del-pastel/teachers/getAllTeachers',
				type: 'GET',
				dataType: 'json',
				success: function(response){
					var $select_teachers = $('#teacher-id');

					$.each(response, function(index, obj){
						$select_teachers.append('<option value="' + obj.Teacher.id + '">'
							+ obj.Teacher.name + ' ' + obj.Teacher.last_name
							+ '</option>' );
					});
					$select_teachers.show('show');
				}
			});
		});

		// 2.- Generar eventos para enviar datos
		$('#create-course-container').on('click', '#course-add', function(){
			var selected_value = $('#teacher-id option:selected').val();

			if(selected_value !== "-1"){
				$.ajax({
					url: '/universidad-del-pastel/courses/addByAjax',
					type: 'POST',
					dataType: 'json',
					data: $('#course-add-form').serialize(),
					success: function(response){
						if(response.code === 1){
							$('#modal-message-body').html(response.message);
							$('#modal-message').modal('show');

							// 3. Actualizar la lista de cursos desplegados en nuestro index.html
							$.ajax({
								url: '/universidad-del-pastel/courses/getAllCourses',
								type: 'GET',
								dataType: 'json',
								success: function(courses){
									console.log(courses);
									var $section_courses = $('#courses');
									$section_courses.html('');
									$section_courses.hide();

									var items = [];

									$.each(courses, function(index, obj){
										items.push(
											'<article class="course well">'
											+ '<span class="glyphicon glyphicon-calendar"></span>'
											+ '<time class="created-date" datetime="2014-01-27T19:07:51+00:00">'+ obj.Course.created +'</time>'
											+ '<div class="clearfix"></div>'
											+ '<figure>'
											+ '<img src="../assets/img/testing/question.jpg" alt="" class="img-responsive img-thumbnail">'
											+ '</figure>'
											+ '<h3 class="title">' + obj.Course.name + '</h3>'
											+ '<div class="summary">' + obj.Course.description + '</div>'
											+ '</article>'
										);
									});
									$section_courses.html( items.join('') );
									$section_courses.slideDown('slow');
								}// ends success getAllCourses
							});
						}
					}
				});
			}else{
				alert("Seleccione un profesor");
			}

		});

	});// ends document.ready
})(jQuery);