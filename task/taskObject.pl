package Task;
our @ISA = qw(ExtensibleManagedObject TaskOperations);

VIMRuntime::make_get_set('Task', 'info');

our @property_list = (
   ['info', 'TaskInfo', undef],
);
sub get_property_list {
   my $class = shift;
   my @super_list = $class->SUPER::get_property_list();
   return (@super_list, @property_list);
}


